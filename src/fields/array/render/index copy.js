import React, { useState } from 'react'
import { Field, FastField, ErrorMessage as BaseErrorMesssage, } from 'formik'
import componentResolver from '../../componentResolver'
import Add from './chunks/add'

export default (props) => {
  const {
    initialValues,
    item: {
      id,
      className = "",
      params,
      container,
      add,
      preferInitialValues,
      isDependant = false,
    },
    hideErrors } = props


  let _items = preferInitialValues ? initialValues[id] : (props.valuesRef.current[id] ? props.valuesRef.current[id] : null)
  if (!_items) {
    _items = []
  }

  const [items, setItems] = useState(_items)

  const Component = componentResolver({ componentsLibraries: props.componentsLibraries, item: params })
  if (!Component) {
    return null
  }

  var ContainerComponent = componentResolver({
    componentsLibraries: props.componentsLibraries,
    item: container
  })

  if (!ContainerComponent) {
    ContainerComponent = ({ children }) => <div>{children}</div>
  }

  var AddComponent = componentResolver({
    componentsLibraries: props.componentsLibraries,
    item: add
  })

  if (!AddComponent) {
    AddComponent = Add
  }

  const { arrayHelpers } = props
  const { move, swap, push, insert, unshift, pop, remove, form } = arrayHelpers

  const onAdd = () => {
    const newItem = params.params.placeholder ? params.params.placeholder() : null
    const _i = [...items, newItem]
    onValueChanged(_i)
    push(newItem)
  }

  const onValueChanged = (value) => {
    const { item: { id },
      setFieldValue,
      setFieldTouched,
      setValues } = props

    const _values = { ...props.valuesRef.current }
    _values[id] = value

    props._onValueChanged && props._onValueChanged({ id, value })
    setItems(value)
    //setValues(_values, false)

    //TODO:
    //setFieldValue(id, value, true)
    // setFieldTouched(id, true, false)
  }

  const Renderer = isDependant ? Field : FastField

  return <div>
    <div className={`w-full overflow-x-scroll ${props.item.isHorizontal ? 'flex gap-2 pb-8' : ''}`}>
      {(items && items.length > 0) && items.map((entry, index) => {
        const itemId = `${id}.${index}`
        return <div
          key={index}
          className={`form-control ${!props.item.isHorizontal ? 'mb-4' : ''}  ${className}`}>

          <Renderer type={params.type} name={itemId} >
            {({ field, form }) => {

              const onRemoveRequired = () => {
                remove(index)
                const _i = [...items]
                _i.splice(index, 1)
                onValueChanged(_i)
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
                onValueChanged(_i)
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
                onValueChanged(_i)
              }

              const onEntryValuesChanged = (value) => {
                const _i = [...items]
                _i[index] = value
                onValueChanged(_i)
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
                  {...params.params}
                  onValueChanged={onEntryValuesChanged} />
              </ContainerComponent>
            }}
          </Renderer>
          {!hideErrors ?
            <BaseErrorMesssage
              name={itemId}
              component="div"
              className="text-sm text-red-600 pt-2" />
            : null}
        </div>
      })}
    </div>
    {(!props.disabled && props.item.canAddItems && !items.length < props.item.maxItems) &&
      <AddComponent
        onClick={onAdd}
        title={add.title}
        disabled={items.length >= props.item.maxItems} />
    }
  </div>
}
