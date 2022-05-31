import React from 'react'

export default ({ onClick, title, disabled }) => <div className={`flex justify-center my-10`}>
  <button disabled={disabled}
    type="button"
    onClick={onClick}>
    {title ? title : "Add"}
  </button>
</div>
