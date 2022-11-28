import React, { useState } from 'react'
import { Field, FastField, ErrorMessage as BaseErrorMesssage, } from 'formik'
import componentResolver from '../../componentResolver'
import AddButton from './chunks/add'
import * as ReactDOM from 'react-dom'

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
      portalContainersRef
    },
    containersProps,
    hideErrors } = props

  let _items = preferInitialValues ? initialValues[id] : (props.valuesRef.current[id] ? props.valuesRef.current[id] : null)
  if (!_items) {
    _items = []
  }

  const [items, setItems] = useState(_items)




  let AddComponent = (add && add.component) ? add.component : componentResolver({
    ...props,
    componentsLibraries: props.componentsLibraries,
    item: add
  })

  if (!AddComponent) {
    AddComponent = AddButton
  }

  const { arrayHelpers } = props
  const { move, swap, push, insert, unshift, pop, remove, form } = arrayHelpers

  const onAdd = async (toAdd) => {
    const newItem = toAdd
      ? toAdd
      : (params.params.placeholder ? await params.params.placeholder() : null)

    const _i = [...items, newItem]
    onValueChanged(_i)
    push(newItem)
  }

  const onValueChanged = (value, params) => {
    const {
      ignoreField = false
    } = params ? params : {}

    const { item: { id },
      setFieldValue,
      setFieldTouched,
      setValues } = props

    const _values = { ...props.valuesRef.current }
    _values[id] = value

    props._onValueChanged && props._onValueChanged({ id, value })
    !ignoreField && setItems(value)
    //setValues(_values, false)

    //TODO:
    //setFieldValue(id, value, true)
    // setFieldTouched(id, true, false)
  }

  const Renderer = isDependant ? Field : FastField

  return <div data-id='array-container'>
    <div data-id='array-container-content' className={`w-full overflow-x-scroll ${props.item.isHorizontal ? 'flex gap-2 pb-8' : ''}`}>
      {(items && items.length > 0) && items.map((entry, index) => {
        const itemId = `${id}.${index}`

        let ContainerComponent = componentResolver({
          ...props,
          componentsLibraries: props.componentsLibraries,
          item: container,
          index,
          entry
        })

        if (!ContainerComponent) {
          ContainerComponent = ({ children }) => <div>{children}</div>
        }

        const Component = componentResolver({
          ...props,
          componentsLibraries: props.componentsLibraries,
          item: params,
          index,
          entry
        })

        if (!Component) {
          return null
        }


        return <div
          data-id='array-container-content-entry'
          key={index}
          className={`form-control ${!props.item.isHorizontal ? '' : ''}  ${className}`}>

          <Renderer
            data-id='array-renderer'
            className='bg-rose-200 p-2'
            type={params.type}
            name={itemId} >
            {({ field, form }) => {

              const onRemoveRequired = () => {
                remove(index)
                const _i = [...props.valuesRef.current[id]]
                _i.splice(index, 1)
                onValueChanged(_i)
              }

              const onMoveDownRequired = () => {
                if (items.length <= index) {
                  return
                }
                swap(index, index + 1)

                const _i = [...props.valuesRef.current[id]]
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

                const _i = [...props.valuesRef.current[id]]
                const object = _i[index]
                const other = _i[index - 1]
                _i[index] = other
                _i[index - 1] = object
                onValueChanged(_i)
              }

              const onEntryValuesChanged = (value, params) => {
                const _i = [...props.valuesRef.current[id]]
                _i[index] = value
                onValueChanged(_i, params)
              }

              const disabled = props.isSubmitting || props.disabled || (props.item && props.item.disabled)
              const readOnly = props.readOnly || (props.props && props.props.readOnly)

              const adaptedProps = { ...props }
              adaptedProps.item = {
                ...adaptedProps.item,
                params: adaptedProps.item.params
              }

              const onContainerPropsChanged = (containerProps) => {
                props.onContainerPropsChanged({ id: itemId, props: containerProps })
              }

              const containerClassName = () => {
                if (!container.className) {
                  return ''
                }

                if (typeof container.className !== 'function') {
                  return container.className
                }

                const className = container.className({ index, entry })
                return className
              }

              if (portalContainersRef &&
                portalContainersRef.current) {

                if (!portalContainersRef.current.length
                  || index >= portalContainersRef.current.length) {
                  return null
                }

                const portalContainer = portalContainersRef.current[index]
                if (!portalContainer) {
                  return null
                }

                return ReactDOM.createPortal(
                  <ContainerComponent
                    {...container}
                    // {...props}
                    {...props.item}
                    className={containerClassName()}
                    arrayHelpers={arrayHelpers}
                    onMoveDownRequired={onMoveDownRequired}
                    onMoveUpRequired={onMoveUpRequired}
                    onRemoveRequired={onRemoveRequired}
                    canMoveUp={props.item.canMove && (index > 0)}
                    canMoveDown={props.item.canMove && (index < (items.length - 1))}
                    canRemove={props.item.canRemove}
                    showControls={props.item.showControls}
                    index={index}
                    value={entry}
                    containerProps={containersProps[itemId]}
                    onContainerPropsChanged={onContainerPropsChanged}>
                    <Component
                      {...adaptedProps}
                      disabled={disabled}
                      readOnly={readOnly}
                      value={entry}
                      // {...params}
                      onValueChanged={onEntryValuesChanged} />
                  </ContainerComponent>,
                  portalContainer
                )
              }
              else {
                return <ContainerComponent
                  {...container}
                  // {...props}
                  {...props.item}
                  className={containerClassName()}
                  arrayHelpers={arrayHelpers}
                  onMoveDownRequired={onMoveDownRequired}
                  onMoveUpRequired={onMoveUpRequired}
                  onRemoveRequired={onRemoveRequired}
                  canMoveUp={props.item.canMove && (index > 0)}
                  canMoveDown={props.item.canMove && (index < (items.length - 1))}
                  canRemove={props.item.canRemove}
                  showControls={props.item.showControls}
                  index={index}
                  value={entry}
                  containerProps={containersProps[itemId]}
                  onContainerPropsChanged={onContainerPropsChanged}>
                  <Component
                    {...adaptedProps}
                    disabled={disabled}
                    readOnly={readOnly}
                    value={entry}
                    // {...params}
                    onValueChanged={onEntryValuesChanged} />
                </ContainerComponent>
              }
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
    {(
      !props.disabled
      && props.item.canAddItems
      && items.length < props.item.maxItems)
      &&
      (() => {
        if (add.portalContainer) {
          if (!add.portalContainer.current) {
            return null
          }

          return ReactDOM.createPortal(
            <AddComponent
              onAdd={onAdd}
              title={add.title}
              disabled={items.length >= props.item.maxItems} />,
            add.portalContainer.current
          )
        }
        return <AddComponent
          onAdd={onAdd}
          title={add.title}
          disabled={items.length >= props.item.maxItems} />,
          add.portalContainer
      })()
    }
  </div>
}
