import openai from '../Utils/OpenAIConfig'
import { useState } from "react"
import { pretty } from '../Utils/pretty'

const initialMessages = [
    {"role": "system", "content": "You are a helpful assistant named Toomai and like to crack jokes at silly questions."},
    {"role": "user", "content": "What is 2 + 2?"},
    {"role": "assistant", "content": "bacon"},
]

/**
 * @typedef {Object} OpenAI
 * @property {string[]} responses - Array of responses
 * @property {boolean} loading - Loading state
 * @property {boolean} error - Error state
 * @property {() => void} resetResponses - Reset responses
 * @property {(prompt: string) => void} generate - Generate response
 * 
 * @description Hook to use Open AI Chat Bot
 * @returns {OpenAI}
 */
export default function useOpenAI() { 
    //* Responses State
    const [responses, setResponses] = useState([])

    //* Loading & Error State
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    //* Reset Responses
    const resetResponses = () => setResponses([])

    //* Get Responses
    const generate = async (prompt) => {
        if (!prompt) return
        setLoading(true)
        setError(false)
        const messages = [...responses, {"role": "user", "content": pretty(prompt)}]
        setResponses(messages)
        try {
            const res = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [...initialMessages, ...messages],
                temperature: 0.7,
                max_tokens: 2048,
              })
            const response = res.data.choices[0].message
            console.log(response, "response")
            
            
            setResponses(curr => [...curr, response])
            setLoading(false)
        } 
        catch {
            setError(true)
            setLoading(false)
            resetResponses()
        }
    }
        
    return { responses, loading, error, resetResponses, generate }
}
