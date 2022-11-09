import React from 'react'

export default ({ onAdd, title, disabled }) => <div className={`flex justify-center my-10`}>
  <button disabled={disabled}
    type="button"
    onClick={onAdd}>
    {title ? title : "Add"}
  </button>
</div>
