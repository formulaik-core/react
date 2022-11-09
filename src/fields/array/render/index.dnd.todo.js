import React, { useState } from 'react'
import { Field, FastField, ErrorMessage as BaseErrorMesssage, } from 'formik'
import componentResolver from '../../componentResolver'
import Add from './chunks/add'
import * as ReactDOM from 'react-dom'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"


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




  let AddComponent = componentResolver({
    ...props,
    componentsLibraries: props.componentsLibraries,
    item: add
  })

  if (!AddComponent) {
    AddComponent = Add
  }

  const { arrayHelpers } = props
  const { move, swap, push, insert, unshift, pop, remove, form } = arrayHelpers

  const onAdd = async () => {
    const newItem = params.params.placeholder ? await params.params.placeholder() : null
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

  const onDragEnd = (result) => {
    // // dropped outside the list
    // if (!result.destination) {
    //   return;
    // }

    // const items = reorder(
    //   this.state.items,
    //   result.source.index,
    //   result.destination.index
    // );

    // this.setState({
    //   items
    // });
  }

  return <div data-id='array-container'>
    <div data-id='array-container-content'
      className={`w-full p-2 bg-red-400 overflow-x-scroll ${props.item.isHorizontal ? 'flex gap-2 pb-8' : ''}`}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              // style={getListStyle(snapshot.isDraggingOver)}
              className={`
                p-2 
                bg-red-100
                transition-all
                ease-in-out
                duration-150
                ${snapshot.isDraggingOver ? 'scale-100' : 'scale-100'}
              `}>
              {(items && items.length > 0) && items.map((entry, index) => {
                const itemId = `${id}.${index}`

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

                return <div
                  key={index}
                  className={`form-control ${!props.item.isHorizontal ? '' : ''}  ${className}`}>
                  <Renderer
                    className='bg-rose-200 p-2'
                    type={params.type}
                    name={itemId} >
                    {({ field, form }) => {

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

                      const DraggableWrapper = ({ children }) =>
                        <Draggable
                          key={itemId}
                          draggableId={itemId}
                          className={`w-full`}
                          index={index}>
                          {(provided, snapshot) => (<div
                            data-id='array-container-content-entry'
                            key={index}
                            className={`form-control w-full ${!props.item.isHorizontal ? '' : ''}  ${className}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >{children}</div>)}
                        </Draggable>

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
                          <DraggableWrapper>
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
                            </ContainerComponent>
                          </DraggableWrapper>,
                          portalContainer
                        )
                      }
                      else {
                        return <DraggableWrapper><ContainerComponent
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
                        </DraggableWrapper>
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
          )}
        </Droppable>
      </DragDropContext>
    </div>
    {(!props.disabled && props.item.canAddItems && !items.length < props.item.maxItems) &&
      <AddComponent
        onClick={onAdd}
        title={add.title}
        disabled={items.length >= props.item.maxItems} />
    }
  </div>
}

const grid = 2

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
})