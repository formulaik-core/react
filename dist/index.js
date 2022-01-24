function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var formik = require('formik');
var nanoid = require('nanoid');

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var componentInLibraries = (function (props) {
  var _props$componentsLibr = props.componentsLibraries,
      componentsLibraries = _props$componentsLibr === void 0 ? [function () {
    return null;
  }] : _props$componentsLibr,
      item = props.item;

  for (var i = 0; i < componentsLibraries.length; i++) {
    var component = componentsLibraries[i](item);

    if (component) {
      return component;
    }
  }

  return null;
});

var FieldArray = (function (props) {
  var values = props.values,
      _props$item = props.item,
      type = _props$item.type,
      id = _props$item.id,
      label = _props$item.label,
      _props$item$forceLabe = _props$item.forceLabel,
      forceLabel = _props$item$forceLabe === void 0 ? false : _props$item$forceLabe,
      _props$item$className = _props$item.className,
      className = _props$item$className === void 0 ? "" : _props$item$className,
      itemProps = _props$item.props,
      onValuesChanged = props.onValuesChanged,
      setFieldValue = props.setFieldValue,
      setFieldTouched = props.setFieldTouched;
  var items = values[id] ? values[id] : [];
  var entryFormProvider = itemProps.entryFormProvider;
  var Component = componentInLibraries({
    componentsLibraries: props.componentsLibraries,
    item: entryFormProvider
  });

  if (!Component) {
    return null;
  }

  var customOnValueChanged = function customOnValueChanged(value) {
    setFieldValue(id, value);
    setFieldTouched(id, true, false);

    var _values = _extends({}, props.values);

    _values[id] = value;
    onValuesChanged && onValuesChanged(_values);
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "form-control mb-4 " + className
  }, label && forceLabel && /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement(formik.FieldArray, {
    type: type,
    name: id
  }, function (arrayHelpers) {
    var swap = arrayHelpers.swap,
        remove = arrayHelpers.remove;
    return /*#__PURE__*/React.createElement("div", null, items && items.length && items.map(function (entry, index) {
      var itemId = id + "." + index;
      return /*#__PURE__*/React.createElement("div", {
        key: index,
        className: "form-control mb-4 " + className
      }, /*#__PURE__*/React.createElement(formik.Field, {
        type: entryFormProvider.type,
        name: itemId
      }, function (_ref) {

        var onRemoveRequired = function onRemoveRequired() {
          remove(index);

          var _i = [].concat(items);

          _i.splice(index, 1);

          customOnValueChanged(_i);
        };

        var onMoveDownRequired = function onMoveDownRequired() {
          if (items.length <= index) {
            return;
          }

          swap(index, index + 1);

          var _i = [].concat(items);

          var object = _i[index];
          var other = _i[index + 1];
          _i[index] = other;
          _i[index + 1] = object;
          customOnValueChanged(_i);
        };

        var onMoveUpRequired = function onMoveUpRequired() {
          if (index === 0) {
            return;
          }

          swap(index, index - 1);

          var _i = [].concat(items);

          var object = _i[index];
          var other = _i[index - 1];
          _i[index] = other;
          _i[index - 1] = object;
          customOnValueChanged(_i);
        };

        var onEntryValuesChanged = function onEntryValuesChanged(value) {
          var _i = [].concat(items);

          _i[index] = value;
          customOnValueChanged(_i);
        };

        return /*#__PURE__*/React.createElement(Component, {
          value: entry,
          arrayHelpers: arrayHelpers,
          onMoveDownRequired: onMoveDownRequired,
          onMoveUpRequired: onMoveUpRequired,
          onRemoveRequired: onRemoveRequired,
          item: entryFormProvider,
          index: index,
          canMoveUp: itemProps.canMove && index > 0,
          canMoveDown: itemProps.canMove && index < items.length - 1,
          canRemove: itemProps.canRemove,
          showControls: itemProps.showControls,
          customOnValueChanged: onEntryValuesChanged
        });
      }), /*#__PURE__*/React.createElement(formik.ErrorMessage, {
        name: itemId,
        component: "div",
        className: "text-sm text-red-600 pt-2"
      }));
    }), itemProps.canAddItems && items.length < itemProps.maxItems && /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick() {
        return arrayHelpers.push(itemProps.placeholder());
      }
    }, "+"));
  }), /*#__PURE__*/React.createElement(formik.ErrorMessage, {
    name: id,
    component: "div",
    className: "text-sm text-red-600 pt-2"
  }));
});

var Field = (function (props) {
  var _props$item = props.item,
      type = _props$item.type,
      id = _props$item.id,
      label = _props$item.label,
      _props$item$forceLabe = _props$item.forceLabel,
      forceLabel = _props$item$forceLabe === void 0 ? false : _props$item$forceLabe,
      _props$item$className = _props$item.className,
      className = _props$item$className === void 0 ? "" : _props$item$className,
      onValuesChanged = props.onValuesChanged;
  var Component = componentInLibraries({
    componentsLibraries: props.componentsLibraries,
    item: props.item
  });

  if (!Component) {
    return null;
  }

  var _id = id ? id : nanoid.nanoid();

  return /*#__PURE__*/React.createElement("div", {
    className: "form-control mb-4 " + className
  }, label && forceLabel && /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement(formik.Field, {
    type: type,
    name: _id
  }, function (_ref) {
    var field = _ref.field,
        form = _ref.form;

    var customOnValueChanged = function customOnValueChanged(value) {
      if (!props.item.id) {
        return;
      }

      var id = props.item.id,
          setFieldValue = props.setFieldValue,
          setFieldTouched = props.setFieldTouched;
      setFieldValue(id, value);
      setFieldTouched(id, true, false);

      var _values = _extends({}, props.values);

      _values[id] = value;
      onValuesChanged && onValuesChanged(_values);
    };

    return /*#__PURE__*/React.createElement(Component, _extends({}, props, {
      field: field,
      form: form,
      customOnValueChanged: customOnValueChanged
    }));
  }), /*#__PURE__*/React.createElement(formik.ErrorMessage, {
    name: _id,
    component: "div",
    className: "text-sm text-red-600 pt-2"
  }));
});

var generate = function generate(props) {
  var formItemsProvider = props.formItemsProvider;
  var items = Array.isArray(formItemsProvider) ? formItemsProvider : formItemsProvider();
  return /*#__PURE__*/React.createElement(formik.Form, {
    className: "grid grid-flow-row"
  }, items.map(function (item) {
    var isMulti = item.isMulti;

    if (isMulti) {
      return _generateItemsView(_extends({}, props, {
        item: item
      }));
    }

    return _generateItemView(_extends({}, props, {
      item: item
    }));
  }));
};

var _generateItemsView = function _generateItemsView(props) {
  var _props$item = props.item,
      className = _props$item.className,
      items = _props$item.items;
  return /*#__PURE__*/React.createElement("div", {
    className: className
  }, items.map(function (_item) {
    return _generateItemView(_extends({}, props, {
      item: _item
    }));
  }));
};

var _generateItemView = function _generateItemView(props) {
  var item = props.item;

  if (item.hide) {
    return null;
  }

  if (item.isList) {
    return /*#__PURE__*/React.createElement(FieldArray, props);
  }

  return /*#__PURE__*/React.createElement(Field, props);
};

var index = (function (props) {
  var onSubmit = props.onSubmit,
      error = props.error;
  var initialValues = typeof props.initialValues !== 'function' ? props.initialValues : props.initialValues && props.initialValues();
  var validationSchema = typeof props.validationSchema !== 'function' ? props.validationSchema : props.validationSchema && props.validationSchema();

  var onValuesChanged = function onValuesChanged(values) {
    props.onValuesChanged && props.onValuesChanged(values);
    console.log('onValuesChanged hook');
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(formik.Formik, {
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit
  }, function (formProps) {
    return generate(_extends({}, formProps, props, {
      initialValues: initialValues,
      validationSchema: validationSchema,
      onValuesChanged: onValuesChanged
    }));
  }), error && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-error mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    className: "w-6 h-6 mx-2 stroke-current"
  }, /*#__PURE__*/React.createElement("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": "2",
    d: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
  })), /*#__PURE__*/React.createElement("label", null, error.message))));
});

module.exports = index;
//# sourceMappingURL=index.js.map
