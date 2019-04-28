import React from 'react'
import Mainbar from './Mainbar'

const layoutStyle = {
  display: 'flex',
  height: 'fit-content',
  fontFamily: 'Open sans',
  paddingTop: 50
}

const Layout = (props) => {
  return (
    <div style={layoutStyle}>
      <div id='main'>
        <Mainbar />
        {props.children}
      </div>
    </div>
  )
}

export default Layout