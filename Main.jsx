import React from "react"
import IngredientsList from "./components/IngredientsList"
import ClaudeRecipe from "./components/ClaudeRecipe"
import { getRecipeFromMistral } from "./ai"

export default function Main() {
    const [ingredients, setIngredients] = React.useState([])
    const [recipe, setRecipe] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [placeholder, setPlaceholder] = React.useState("e.g. oregano")
    
    // 1. Create a ref to target the recipe section
    const recipeSection = React.useRef(null)

    // 2. This effect runs every time 'recipe' changes
    React.useEffect(() => {
        if (recipe !== "" && recipeSection.current !== null) {
            // Scroll smoothly to the recipe section
            recipeSection.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [recipe])

    async function getRecipe() {
        setRecipe("")           
        setIsLoading(true)      
        try {
            const recipeMarkdown = await getRecipeFromMistral(ingredients)
            setRecipe(recipeMarkdown)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false) 
        }
    }

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient").trim()
        if (newIngredient === "") return
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    }

    function handleAdd(e) {
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)
        const value = String(formData.get("ingredient") || "").trim()
        if (!value) {
            const prev = placeholder
            setPlaceholder("Give ingredients")
            setTimeout(() => setPlaceholder(prev), 2500)
            return
        }
        addIngredient(formData)
        form.reset()
    }

    return (
        <main>
            <form onSubmit={handleAdd} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder={placeholder}
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button type="submit">Add ingredient</button>
            </form>

            {ingredients.length > 0 &&
                <IngredientsList
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                />
            }

            {isLoading ? (
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>The Chef is thinking...</p>
                </div>
            ) : (
                // 3. Attach the ref to a wrapper div here
                recipe && (
                    <div ref={recipeSection}>
                        <ClaudeRecipe recipe={recipe} />
                    </div>
                )
            )}
        </main>
    )
}