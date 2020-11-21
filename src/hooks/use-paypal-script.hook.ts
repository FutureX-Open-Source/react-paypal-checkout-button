import { useEffect, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { UsePayPalScriptOptions } from '../types'

const usePayPalScript = ({
  clientId,
  currency,
  onError,
  intent
}: UsePayPalScriptOptions) => {
  const INTENT = intent ? `&intent=${intent?.toLocaleLowerCase()}` : ''

  const [scriptState, setScriptState] = useState({
    loading: false,
    loaded: false,
    error: {
      errorMessage: '',
      shouldRetry: false
    }
  })

  const {
    loading,
    loaded,
    error: { errorMessage }
  } = scriptState

  useEffect(() => {
    if (errorMessage) return

    if (!clientId) {
      const errorMessage = 'Client id is missing'
      onError && onError(new Error(errorMessage))

      console.error(errorMessage)

      return setScriptState({
        loading: false,
        loaded: false,
        error: {
          errorMessage,
          shouldRetry: false
        }
      })
    }

    // console.log({ ScriptState })

    if (!loading && !loaded && !errorMessage) {
      setScriptState((prev) => ({ ...prev, loading: true }))

      const script = document.createElement('script')
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}${INTENT}`

      script.addEventListener('load', () =>
        setScriptState((prev) => ({ ...prev, loading: false, loaded: true }))
      )

      document.body.appendChild(script)

      script.addEventListener('error', (error) => {
        console.error(error)

        onError && onError(error)

        return setScriptState({
          loading: false,
          loaded: false,
          error: {
            errorMessage: `An error occured while loading paypal smart buttons`,
            shouldRetry: true
          }
        })
      })
    }
  }, [scriptState])

  return {
    scriptState,
    setScriptState
  }
}

export default usePayPalScript