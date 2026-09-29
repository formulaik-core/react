/* eslint-env jest */
import React, { useEffect, useState } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import Formulaik from './Formulaik.js'

// A text field the way real component libraries write them: it keeps what it shows in its own
// state and reports every keystroke through onValueChanged. `params.debounce` stands for a
// component that asks the engine to delay its commits (the old per-input `inputDelay`).
const TextInput = ({ value, onValueChanged, item }) => {
  const [shown, setShown] = useState(value || '')
  useEffect(() => {
    setShown(value || '')
  }, [value])
  const { debounce } = item.params || {}
  return (
    <input
      data-testid={item.id}
      value={shown}
      onChange={(e) => {
        setShown(e.target.value)
        onValueChanged(e.target.value, debounce !== undefined ? { debounce } : undefined)
      }}
    />
  )
}

const Submit = ({ submitForm }) => (
  <button data-testid='submit' onClick={submitForm}>
    Go
  </button>
)

const library = ({ type }) => ({ text: TextInput, submit: Submit }[type])

const text = (id, extra = {}) => ({ component: 'text', id, type: 'string', ...extra })
const submit = { component: 'submit', id: 'submit' }

const renderForm = (props) =>
  render(<Formulaik hideBrand components={[library]} values={{}} {...props} />)

const type = (id, value) => fireEvent.change(screen.getByTestId(id), { target: { value } })

const lastValues = (spy) => spy.mock.calls[spy.mock.calls.length - 1][0]

// Lets pending promise continuations (submit, validation) run under fake timers.
const settle = async () => {
  for (let i = 0; i < 5; i++) {
    await act(async () => {
      await Promise.resolve()
      jest.advanceTimersByTime(0)
    })
  }
}

beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

describe('onFormPropsChanged (motif roadmap 5.2)', () => {
  test('is not called while React is rendering the form', () => {
    const errors = jest.spyOn(console, 'error').mockImplementation(() => { })
    const Parent = () => {
      const [, setSeen] = useState('')
      return (
        <Formulaik
          hideBrand
          components={[library]}
          values={{}}
          inputs={[text('title')]}
          onFormPropsChanged={(formProps) => setSeen(formProps.values.title || '')}
        />
      )
    }
    render(<Parent />)
    type('title', 'Hello')

    const renderPhaseUpdates = errors.mock.calls.filter((call) =>
      String(call[0]).includes('Cannot update a component')
    )
    errors.mockRestore()
    expect(renderPhaseUpdates).toEqual([])
  })

  test('is not called again when only the parent re-renders', () => {
    const onFormPropsChanged = jest.fn()
    const inputs = [text('title')]
    const { rerender } = renderForm({ inputs, onFormPropsChanged })
    const afterMount = onFormPropsChanged.mock.calls.length

    rerender(
      <Formulaik
        hideBrand
        components={[library]}
        values={{}}
        inputs={inputs}
        onFormPropsChanged={onFormPropsChanged}
      />
    )

    expect(afterMount).toBeGreaterThan(0)
    expect(onFormPropsChanged.mock.calls.length).toBe(afterMount)
  })

  test('hands over the form state after a change', () => {
    const onFormPropsChanged = jest.fn()
    renderForm({ inputs: [text('title')], onFormPropsChanged })
    type('title', 'Hello')

    expect(lastValues(onFormPropsChanged).values.title).toBe('Hello')
  })
})

describe('engine-owned debounce (motif roadmap 5.3)', () => {
  test('without a debounce, a change is committed right away', () => {
    const onValuesChanged = jest.fn()
    renderForm({ inputs: [text('title')], onValuesChanged })
    type('title', 'Hello')

    expect(lastValues(onValuesChanged)).toEqual({ title: 'Hello' })
  })

  test('an input definition debounce delays the commit and keeps the last value', () => {
    const onValuesChanged = jest.fn()
    renderForm({ inputs: [text('title', { debounce: 300 })], onValuesChanged })
    type('title', 'H')
    type('title', 'He')
    act(() => {
      jest.advanceTimersByTime(299)
    })
    expect(onValuesChanged).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(onValuesChanged).toHaveBeenCalledTimes(1)
    expect(lastValues(onValuesChanged)).toEqual({ title: 'He' })
  })

  test('a component can ask for a debounce when it reports a value', () => {
    const onValuesChanged = jest.fn()
    renderForm({ inputs: [text('title', { params: { debounce: 200 } })], onValuesChanged })
    type('title', 'Hello')
    expect(onValuesChanged).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(200)
    })
    expect(lastValues(onValuesChanged)).toEqual({ title: 'Hello' })
  })

  test('the input definition wins over what the component asks for', () => {
    const onValuesChanged = jest.fn()
    renderForm({
      inputs: [text('title', { debounce: 0, params: { debounce: 500 } })],
      onValuesChanged,
    })
    type('title', 'Hello')

    expect(lastValues(onValuesChanged)).toEqual({ title: 'Hello' })
  })

  test('the form can set a default debounce for every field', () => {
    const onValuesChanged = jest.fn()
    renderForm({ inputs: [text('title')], debounce: 250, onValuesChanged })
    type('title', 'Hello')
    expect(onValuesChanged).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(250)
    })
    expect(lastValues(onValuesChanged)).toEqual({ title: 'Hello' })
  })

  test('leaving the field commits the pending value at once', () => {
    const onValuesChanged = jest.fn()
    renderForm({ inputs: [text('title', { debounce: 1000 })], onValuesChanged })
    type('title', 'Hello')
    fireEvent.blur(screen.getByTestId('title'))

    expect(lastValues(onValuesChanged)).toEqual({ title: 'Hello' })
  })

  test("'blur' commits only when the field loses focus", () => {
    const onValuesChanged = jest.fn()
    renderForm({ inputs: [text('title', { debounce: 'blur' })], onValuesChanged })
    type('title', 'Hello')
    act(() => {
      jest.advanceTimersByTime(60000)
    })
    expect(onValuesChanged).not.toHaveBeenCalled()

    fireEvent.blur(screen.getByTestId('title'))
    expect(lastValues(onValuesChanged)).toEqual({ title: 'Hello' })
  })

  test('a field that unmounts drops its pending value, as the per-input debounce did', () => {
    const onValuesChanged = jest.fn()
    const { unmount } = renderForm({
      inputs: [text('title', { debounce: 300 })],
      onValuesChanged,
    })
    type('title', 'Hello')
    unmount()
    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(onValuesChanged).not.toHaveBeenCalled()
  })
})

describe('submit waits for pending input', () => {
  const required = [{ kind: 'required', value: true, message: 'Required' }]

  test('the submit button sends what the field shows, not what the form held', async () => {
    const onSubmit = jest.fn()
    renderForm({
      inputs: [text('title', { debounce: 1000, validations: required }), submit],
      onSubmit,
    })
    type('title', 'Hello')
    fireEvent.click(screen.getByTestId('submit'))
    await settle()

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0]).toEqual({ title: 'Hello' })
  })

  test('a native form submit (Enter) flushes too', async () => {
    const onSubmit = jest.fn()
    const { container } = renderForm({
      inputs: [text('title', { debounce: 1000, validations: required })],
      onSubmit,
    })
    type('title', 'Hello')
    fireEvent.submit(container.querySelector('form'))
    await settle()

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0]).toEqual({ title: 'Hello' })
  })

  test('a click and the native submit it triggers submit once', async () => {
    const onSubmit = jest.fn()
    const { container } = renderForm({
      inputs: [text('title', { debounce: 1000 }), submit],
      onSubmit,
    })
    type('title', 'Hello')
    fireEvent.click(screen.getByTestId('submit'))
    fireEvent.submit(container.querySelector('form'))
    await settle()

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  test('a field can register async work that submit waits for', async () => {
    let finish
    const Checking = ({ registerPendingInput, onValueChanged }) => {
      useEffect(
        () =>
          registerPendingInput(
            () =>
              new Promise((resolve) => {
                finish = () => {
                  onValueChanged('checked')
                  resolve()
                }
              })
          ),
        []
      )
      return null
    }
    const withChecking = (item) => (item.type === 'checking' ? Checking : library(item))
    const onSubmit = jest.fn()
    render(
      <Formulaik
        hideBrand
        components={[withChecking]}
        values={{}}
        inputs={[{ component: 'checking', id: 'slug' }, submit]}
        onSubmit={onSubmit}
      />
    )
    fireEvent.click(screen.getByTestId('submit'))
    await settle()
    expect(onSubmit).not.toHaveBeenCalled()

    await act(async () => {
      finish()
    })
    await settle()
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0]).toEqual({ slug: 'checked' })
  })

  test('validateForm handed to the consumer validates the flushed value', async () => {
    const onFormPropsChanged = jest.fn()
    renderForm({
      inputs: [text('title', { debounce: 1000, validations: required })],
      onFormPropsChanged,
    })
    type('title', 'Hello')
    let promise
    act(() => {
      promise = lastValues(onFormPropsChanged).validateForm()
    })
    await settle()

    expect(await promise).toEqual({})
  })
})
