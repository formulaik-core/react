export default (props) => {
  const { componentsLibraries = [() => null], item } = props

  for (var i = 0; i < componentsLibraries.length; i++) {
    const component = componentsLibraries[i](item)
    if (component) {
      return component
    }
  }

  return null
}
