import React from 'react'
import { Field, ErrorMessage as BaseErrorMesssage, FieldArray, getIn } from 'formik'
import componentInLibraries from './componentInLibraries'

const ErrorMessage = ({ name }) => (
  <Field
    name={name}
    render={({ form }) => {
      const error = getIn(form.errors, name)
      const touch = getIn(form.touched, name)
      return touch && error ? error : null
    }}
  />
)


export default (props) => {
  const {
    values,
    item: { type, id, label, forceLabel = false, className = "", props: itemProps },
    onValuesChanged,
    setFieldValue,
    setFieldTouched } = props

  const items = values[id] ? values[id] : []

  const { entryFormProvider } = itemProps
  const Component = componentInLibraries({ componentsLibraries: props.componentsLibraries, item: entryFormProvider })
  if (!Component) {
    return null
  }

  const customOnValueChanged = (value) => {
    // const { item: { id }, setFieldValue, setFieldTouched } = props
    setFieldValue(id, value)
    setFieldTouched(id, true, false)
    const _values = { ...props.values }
    _values[id] = value
    onValuesChanged && onValuesChanged(_values)
  }

  return <div className={`form-control mb-4 ${className}`}>
    {
      (label && forceLabel) &&
      <label className="label">
        <span>{label}</span>
      </label>
    }
    <FieldArray
      type={type}
      name={id}>
      {arrayHelpers => {
        const { move, swap, push, insert, unshift, pop, remove, form } = arrayHelpers
        return <div>
          {items && items.length > 0 && items.map((entry, index) => {
            const itemId = `${id}.${index}`
            return <div key={index} className={`form-control mb-4 ${className}`}>
              {/* {
                (label && forceLabel) &&
                <label className="label">
                  <span>{label}</span>
                </label>
              } */}

              <Field type={entryFormProvider.type} name={itemId} >
                {({ field, form }) => {
                  const onRemoveRequired = () => {
                    remove(index)
                    const _i = [...items]
                    _i.splice(index, 1)
                    customOnValueChanged(_i)
                  }

                  const onMoveDownRequired = () => {
                    if (items.length <= index) {
                      return
                    }
                    swap(index, index + 1)

                    const _i = [...items]
                    const object = _i[index]
                    const other = _i[index + 1]
                    _i[index] = other
                    _i[index + 1] = object
                    customOnValueChanged(_i)
                  }

                  const onMoveUpRequired = () => {
                    if (index === 0) {
                      return
                    }
                    swap(index, index - 1)

                    const _i = [...items]
                    const object = _i[index]
                    const other = _i[index - 1]
                    _i[index] = other
                    _i[index - 1] = object
                    customOnValueChanged(_i)
                  }

                  const onEntryValuesChanged = (value) => {
                    const _i = [...items]
                    _i[index] = value
                    customOnValueChanged(_i)
                  }

                  return <Component
                    value={entry}
                    arrayHelpers={arrayHelpers}
                    onMoveDownRequired={onMoveDownRequired}
                    onMoveUpRequired={onMoveUpRequired}
                    onRemoveRequired={onRemoveRequired}
                    item={entryFormProvider}
                    index={index}
                    canMoveUp={itemProps.canMove && (index > 0)}
                    canMoveDown={itemProps.canMove && (index < (items.length - 1))}
                    canRemove={itemProps.canRemove}
                    showControls={itemProps.showControls}
                    customOnValueChanged={onEntryValuesChanged} />
                }}
              </Field>
              <BaseErrorMesssage
                name={itemId}
                component="div"
                className="text-sm text-red-600 pt-2" />
            </div>
          })}
          {(itemProps.canAddItems && items.length < itemProps.maxItems) &&
            <div className={`flex justify-center my-10`}>
              {itemProps.addComponent
                ? itemProps.addComponent({ onClick: () => arrayHelpers.push(itemProps.placeholder()) })
                : <button
                  type="button"
                  onClick={() => arrayHelpers.push(itemProps.placeholder())}>
                  +
                </button>
              }</div>}
        </div>
      }}
    </FieldArray >
    <ErrorMessage
      name={id}
      component="div"
      className="text-sm text-red-600 pt-2" />
  </div>
}
