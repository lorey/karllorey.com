<!--
.. title: How to recover an AWS EC2 instance without the private key
.. slug: recover-aws-ec2-instance-without-private-key
.. date: 2019-09-03 10:30:13 UTC+01:00
.. tags: AWS, Tech
.. category: Tech
.. link: 
.. description: 
.. type: text
-->

Lost the private key for your EC2 instance and can't login via ssh anymore?
This tutorial will show you how to recover your EC2 instance by setting a new key pair to login.

What we'll do:

* mount the original instance's volume (a.k.a. it's filesystem) inside another temporary EC2 instance
* modify the keys allowed to login
* unmount the volume from the temporary instance and re-mount it in the original instance
* login with a new key to your original instance

In short, this replaces the key needed for ssh to connect with a new one of your choice.
<!-- TEASER_END -->

## AWS Recovery Automation
There's an [Amazon recovery automation thing](https://aws.amazon.com/premiumsupport/knowledge-center/recover-access-lost-key-pair/) available that aims to recover your instance automatically,
it sadly did not work for me.
So here we go.

## Step 1: Find the instance
Go to the AWS EC2 console and find your (lost) instance.
Make sure you're in the right availability zone.
Note down the instance ID as well as the subnet.
Also note the instance's volume

## Step 2: Create a temporary instance
Launch an instance in the same availability zone.
Make sure to use the same subnet.
Create a new key pair with that instance
or use the key pair you'd like to use for your original instance from now on.

## Step 3: Attach the original volume to a temporary instance
Stop the original instance to be able to unmount the storage.
Note the volume ID under `Attachment information`.
Go to volumes and detach the volume with `Actions - Detach Volume`.
Attach the volume to the temporary instance with `Actions - Attach Volume`.
Choose one of the given options and note it down, e.g. `/dev/sdf`.
Connect to the temporary instance via SSH and mount the volume, e.g. to `/data` via the following command:
```text
mount /dev/sdf /data
```
The volume of the original instance is now mounted to `/data`.
This allows us to now modify the allowed keys.

## Step 4: Modify the allowed keys
We can now set the key of the current, temporary instance as an allowed key of the original instance.
The keys allowed to log in are stored in a file called `~/.ssh/authorized_keys` (background on [authorized_keys](https://www.ssh.com/ssh/authorized_keys/)).
Inside this file is just a line-by-line list of authorized keys.
Because of this, we can just append the file of our temporary instance (and thus our key from the temporary instance)
to the file of our original instance.
```text
cat ~/.ssh/authorized_keys >> /data/home/admin/.ssh/authorized_keys
```
Make sure to swap admin with the actual user you want to sign in as (check your ssh connection command if you're unsure).

### Check if everything went right
```text
cat /data/home/admin/.ssh/authorized_keys
```
should now contain the contents of:
```text
cat ~/.ssh/authorized_keys
```

## Step 4: Bring everything back in order
We now have set up another key for login.
All that's left is to unmount the volume from the temporary instance and mount it to the original instance.

First, we have to unmout the storage of the original instance inside the temporary instance by
`umount /dev/sdf` (make sure to use the right path here).
Afterwards, you stop the temporary instance via the AWS console under `Instances`.
You then attach the volume to the original instance inside the AWS console under `Volumes` via `Actions - Attach volume`.
Type in the original instance ID as well as `xvda` as the mount point.
Otherwise, you might get an error pointing out that there's no root volume when starting the instance.
You can now re-start the original instance and should be able to login with the new key.

Make sure to delete the temporary instance in case everything went well.

## Conclusion
So this guide showed you how to recover an AWS EC2 instance if you lose you private key.
We did this by using a temporary instance to swap or actually extend the authorized_keys file.
You should now be able to login to the original instance with your new key.

There's also a slightly different [guide by AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#replacing-lost-key-pair).