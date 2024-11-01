// import React from 'react'
import Word from '../WordAnimation/Word'
import './nav.css'

const Nav = () => {
  return (
    <div className="nav-wraper">
      <div>
        <div>XYZ</div>
      </div>
      <div> 
        <Word text='MENU'
              fontFamily='"Bebas Neue", sans-serif'
              fontStyle='normal'
              fontSize='0.9rem'/>
        </div>
    </div>
  )
}

export default Nav
