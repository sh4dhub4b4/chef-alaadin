import ReactMarkdown from 'react-markdown'

export default function ClaudeRecipe(props) {
    return (
        <section className="suggested-recipe-container" aria-live="polite">
            <h2>Chef Recommends:</h2>
            {/* This converts the markdown string to HTML tags */}
            <ReactMarkdown>{props.recipe}</ReactMarkdown>
        </section>
    )
}