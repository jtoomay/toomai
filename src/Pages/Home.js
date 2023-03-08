import React, { useRef, useState, useEffect } from 'react'
import Loading from '../Components/Loading'
import tw, { styled } from 'twin.macro'
import useOpenAI from '../Hooks/useOpenAI'
import { css } from '@emotion/react'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco, dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';


export default function Home() {
  // Pull out the needed functions and variables from the useOpenAI hook
  const { responses, loading, error, resetResponses, generate } = useOpenAI()
  // Create a state variable for the prompt
  const [prompt, setPrompt] = useState('')

  const scrollToRef = useRef()
  const loadingRef = useRef()

  // Function that will fire when the user clicks the Go! button
  const handleGo = () => {
    if (!prompt) return
    generate(prompt)
    setPrompt('')
  }
  // Function that will fire when the user presses the enter key
  const handleEnter = e => e.key === 'Enter' && handleGo()

  // Scroll to the bottom of the chat history when the loading state changes
  useEffect(() => {
    if (!loading && scrollToRef.current) scrollToRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [loading])
  // Scroll to the bottom of the chat history when the prompt changes
  useEffect(() => {
    if (scrollToRef.current) scrollToRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [prompt])

  return (
    <Wrapper>
      <Title>Chat with Toom-AI</Title>
      <ClearBtn onClick={() => resetResponses()}>Clear</ClearBtn>
      <History>
        {responses.map(({ role, content }, index) => {
          const lastMessage = index + 1 === responses.length
          const message = content.split('```')
          console.log(message, "message")
          // If the message is the last message, set the ref to the scrollToRef, If not, set it to undefined
          return <Message myMessage={role === 'user'} ref={lastMessage ? scrollToRef : undefined}>{message.map((text, index) => {
            if (index % 2 === 0) return text
            else {
              let language;
              if (text.includes("python")) {
                language = "python"
              } else if (text.includes('javascript')) { language = "javascript" }
              else {
                language = "javascript" // TODO: Make this better
              }
              return <SyntaxHighlighter language={language} style={dark} key={text}>{text}</SyntaxHighlighter>
            }
          })}</Message>
        })}

        {loading && <Loading ref={loadingRef} />}
        {error && <ErrorText>An Unexpected Error occured</ErrorText>}
      </History>
      <FormContainer>
        <Input value={prompt} onKeyDown={handleEnter} placeholder="Chat with me..." onChange={(e) => setPrompt(e.target.value)}></Input>
        <Button onClick={handleGo}>Go!</Button>
      </FormContainer>
    </Wrapper>
  )
}

// Wrapper Styles
const Wrapper = styled.div(({ }) => [
  tw`h-full `,
  css`
  --iMessageBlue: #0c84fe;
`

])
const Title = tw.h1`text-3xl text-center pb-4`

// Form Styles

const FormContainer = tw.div`absolute bottom-0 left-0 w-full flex justify-center gap-4 bg-zinc-900 p-4 pb-8`
const Input = tw.input`w-[24rem] p-2 rounded-lg text-zinc-700 xl:w-3/4`
const Button = tw.button`bg-[var(--iMessageBlue)] px-2 rounded-lg`
const History = tw.div`flex flex-col gap-4 overflow-y-auto px-4 pb-4 h-[calc(100% - 15.75rem)] `
const Message = styled.div(({ myMessage }) => [
  tw`p-4 rounded-[20px 20px 20px 0] w-[90%] whitespace-pre-wrap`,
  myMessage ? tw`bg-[var(--iMessageBlue)] rounded-[20px 20px 0 20px] ml-auto` : tw`bg-white text-zinc-900`,
])
const ErrorText = tw.p`text-red-500 text-center`

const ClearBtn = tw.button`bg-[var(--iMessageBlue)] text-white px-4 py-2 rounded-md text-lg font-bold mr-4 absolute top-6 right-6`
