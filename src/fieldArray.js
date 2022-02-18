import React, { useState } from 'react'
import { Field, ErrorMessage as BaseErrorMesssage, FieldArray, getIn } from 'formik'
import componentInLibraries from './componentInLibraries'

export default (props) => {
  const {
    item: { type, id, label, forceLabel = false, className = "", },
    hideErrors,
  } = props

  return <div className={`form-control mb-4 ${className}`}>
    {
      (label && forceLabel) &&
      <label className="label">
        <span>{label}</span>
      </label>
    }
    <FieldArray
      type={type}
      name={id}
      //validateOnChange
      component={(arrayHelpers) => render({ ...props, arrayHelpers })} />
    {/* <FieldArray
      type={type}
      name={id}
      render={(arrayHelpers) => render({ ...props, arrayHelpers })} /> */}
    {/* <FieldArray
      type={type}
      name={id}>
      {(arrayHelpers) => render({ ...props, arrayHelpers })}
    </FieldArray> */}
    {!hideErrors ?
      <ErrorMessage
        name={id}
        component="div"
        className="text-sm text-red-600 pt-2" /> : null}
  </div>
}


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

const render = (props) => {
  const {
    values,
    item: {
      id,
      className = "",
      props: itemProps,
      container,
      add
    },
    onValuesChanged,
    hideErrors } = props

  const items = values[id] ? values[id] : []
  //const [counter, setCounter] = useState(1)

  const { entryFormProvider } = itemProps
  const Component = componentInLibraries({ componentsLibraries: props.componentsLibraries, item: itemProps })
  if (!Component) {
    return null
  }

  const { arrayHelpers } = props
  const { move, swap, push, insert, unshift, pop, remove, form } = arrayHelpers

  const onAdd = () => {
    push(itemProps.props.placeholder())
  }

  const customOnValueChanged = (value) => {
    const { item: { id }, setFieldValue, setFieldTouched, setValues } = props

    const _values = { ...props.values }
    _values[id] = value
    onValuesChanged && onValuesChanged(_values)
    //setValues(_values)
    //TODO:
    // setFieldValue(id, value, true)
    // setFieldTouched(id, true, false)

    //setItems(value)
  }

  var ContainerComponent = componentInLibraries({
    componentsLibraries: props.componentsLibraries,
    item: container
  })

  if (!ContainerComponent) {
    ContainerComponent = ({ children }) => <div>{children}</div>
  }

  var AddComponent = componentInLibraries({
    componentsLibraries: props.componentsLibraries,
    item: add
  })

  if (!AddComponent) {
    AddComponent = ({ onClick, title }) => <div className={`flex justify-center my-10`}><button
      type="button"
      onClick={onClick}>
      {title ? title : "Add"}
    </button>
    </div>
  }




  return <div>
    {(items && items.length > 0) && items.map((entry, index) => {
      const itemId = `${id}.${index}`
      return <div key={index} className={`form-control mb-4 ${className}`}>
        {/* {
        (label && forceLabel) &&
        <label className="label">
          <span>{label}</span>
        </label>
      } */}

        <Field type={itemProps.type} name={itemId} >
          {({ field, form }) => {
            const onRemoveRequired = () => {
              remove(index)
              const _i = [...items]
              _i.splice(index, 1)
              customOnValueChanged(_i)
              //setCounter(counter + 1)
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
              //setCounter(counter + 1)
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
              //setCounter(counter + 1)
            }

            const onEntryValuesChanged = (value) => {
              const _i = [...items]
              _i[index] = value
              customOnValueChanged(_i)
            }

            const disabled = props.isSubmitting || props.disabled || (props.item && props.item.disabled)
            const readOnly = props.readOnly || (props.props && props.props.readOnly)

            return <ContainerComponent
              {...container}
              // {...props}
              arrayHelpers={arrayHelpers}
              onMoveDownRequired={onMoveDownRequired}
              onMoveUpRequired={onMoveUpRequired}
              onRemoveRequired={onRemoveRequired}
              canMoveUp={props.item.canMove && (index > 0)}
              canMoveDown={props.item.canMove && (index < (items.length - 1))}
              canRemove={props.item.canRemove}
              showControls={props.item.showControls}
              index={index}
              value={entry}>
              <Component
                {...props}
                disabled={disabled}
                readOnly={readOnly}
                value={entry}
                {...itemProps.props}
                customOnValueChanged={onEntryValuesChanged} />
            </ContainerComponent>
          }}
        </Field>
        {!hideErrors ?
          <BaseErrorMesssage
            name={itemId}
            component="div"
            className="text-sm text-red-600 pt-2" />
          : null}
      </div>
    })}
    {(!props.disabled && props.item.canAddItems && items.length < props.item.maxItems) &&
      <AddComponent onClick={onAdd} title={add.title} />
    }
  </div>
}
