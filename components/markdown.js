import markdown from './markdown.module.css'

export default function Markdown({html}) {
    return (
        <div dangerouslySetInnerHTML={{__html: html}} className={markdown['markdown']} />
    )
}