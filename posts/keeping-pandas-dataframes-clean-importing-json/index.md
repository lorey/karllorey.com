<!--
.. title: Keeping Pandas DataFrames clean when importing JSON (with Context Managers)
.. slug: keeping-pandas-dataframes-clean-importing-json
.. date: 2019-03-03 10:30:13 UTC+01:00
.. tags: Machine Learning, Pandas, Clean Code, Python, Tech
.. category: Tech 
.. link: 
.. description: 
.. type: text
-->

At [First Momentum](https://firstmomentum.vc), I do a lot of data analysis to find the most promising young startups.
As a first step, you always have to import the desired data into a Pandas DataFrame
and do some preprocessing, for example by importing JSON data from some API. 
When doing this kind of pre-processing,
you usually have a lot of temporary columns in your DataFrame that get imported but need to be dropped later in the process.
To deal with these temporary columns,
I built a custom Context Manager that keeps track of all imported columns
and deletes them when you're done.
This way, your code stays lean and you don't have to remove temporary columns yourself.
In this short article, I will show how you can keep your pre-processing clean
and use a Python ContextManager to clean up temporary columns.
<!-- TEASER_END -->

In this example I will use the actual code I use for importing data from the API of our CRM named Hubspot.
What I retrieve is a list of companies stored as a list of Python dictionaries.
To import a list of dictionaries in pandas you basically do:

```python
from pandas.io.json import json_normalize

df = json_normalize(data)
```

The json_normalize function generates a clean DataFrame based on the given `data` parameter and normalizes the hierarchy so you get clean column names.
This is especially useful for nested dictionaries.

## Ugly: Keeping imported columns
The problem with json_normalize is that you usually only want a subset of the imported columns,
mostly with different names or some kind of pre-processing, too.
So you might be tempted to do something like this:
```python
from pandas.io.json import json_normalize

df = json_normalize(data)

df['company_id'] = df['companyId']
df['location'] = df['properties.city.value']
df['name'] = df['properties.name.value']
df['domain'] = df['properties.website.value']
//... .apply(), .as_type(int), whatever...
```

This works, but keeps all the imported columns inplace and might take a lot of storage.
So what can you do?

## Ugly: Dropping columns manually
So after importing, you want to get rid of all temporary columns from the import.
To do this, you have to either select the columns you want or drop all columns you don't want.
In both cases, you have to somehow keep track of the temporary columns or the ones you want to keep.
To deal with this, one solution would be to prefix temporary columns and delete them afterwards:
```python
from pandas.io.json import json_normalize

df = json_normalize(data)

// make temporary columns
df.columns = ['temp_' + c for c in df.columns]

// pre-processing, basic calculations, etc.
df['company_id'] = df['temp_companyId']
df['location'] = df['temp_properties.city.value']
df['name'] = df['temp_properties.name.value']
df['domain'] = df['temp_properties.website.value']
//... .apply(), .as_type(int), whatever...
```

Afterwards, you would then select all desired columns or drop all undesired columns.
```python
df.drop([c for c in df.columns if c.startswith('temp_')], axis=1, inplace=True)
// or
df = df[[c for c in df.columns if not c.startswith('temp_')]]
```

While this works, it feels bloated and inefficient.
You have to prefix all the value names in the code which results in bloated column names.
You also have to keep track of column names you want in the end
or the used prefix in different places.
Just imagine you have to change the prefix `temp_` one day or make the code work with a different prefix.

## Clean and easy: using a Context Manager
After having used the above methods for some time, it struck me that [Python Context Managers](https://jeffknupp.com/blog/2016/03/07/python-with-context-managers/) might be a cleaner solution.
You might know them from their most popular application `with open() as file:`.
If not, please take a few minutes to read more about them.
To make things short: They basically ensure that something, usually a cleanup, is executed in each exit scenario,
whether it is a usual exit like a return or an exception.
I thought I might use this to build a clean solution that keeps track and gets rid of temporary columns.
So I built a Context Manager that deals with temporary columns when importing JSON data so I don't have to.
You can basically use it like this:

```python
with DataFrameFromDict(companies) as df:
    // imported dict now in df, same result as json_normalize
    df['company_id'] = df['companyId']
    df['location'] = df['properties.city.value']
    df['name'] = df['properties.name.value']
    df['domain'] = df['properties.website.value']
// after context exits, df contains company_id, location, name, and domain
// but no more temporary columns
print(df)
```

The benefit: You don't have to keep track anymore and the context manager handles the deletion of all temporary columns.

## How it works
You can just copy and paste the following snippet to get going, I'll explain how it works below:

```python
class DataFrameFromDict(object):
    """
    Temporarily imports data frame columns and deletes them afterwards.
    """

    def __init__(self, data):
        self.df = json_normalize(data)
        self.columns = list(self.df.columns.values)

    def __enter__(self):
        return self.df

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.df.drop([c for c in self.columns], axis=1, inplace=True)
```

When opening the context, `__init__` and `__enter__` get called.
They create the DataFrame and remember all imported and thus temporary column names.
When the context is exited, `__exit__` makes sure to drop all previously created columns
and leaves only the newly created columns behind.

Hope this helps you to create a clean pre-processing pipeline.
Let me know what you think.
You can find the [code on GitHub](https://gist.github.com/lorey/2b57b4ebfec4d45221e15a49060f80d2).


Further reading:

- [json_normalize](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.io.json.json_normalize.html)
- [Python Context Managers](https://jeffknupp.com/blog/2016/03/07/python-with-context-managers/)