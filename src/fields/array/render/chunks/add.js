
export default ({ onAdd, title, disabled }) => <><div className={`container`}>
  <button disabled={disabled}
    type="button"
    onClick={onAdd}>
    {title ? title : "Add"}
  </button>
</div>
  <style jsx>{`      
      .container {
        /* flex justify-center my-10 */
        display: flex; 
        margin-top: 2.5rem;
        margin-bottom: 2.5rem; 
        justify-content: center; 
      }      
    `}</style>
</>
