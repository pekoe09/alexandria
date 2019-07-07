import React from 'react'
import Mainbar from './Mainbar'

const layoutStyle = {
  display: 'flex',
  minHeight: '100vh',
  fontFamily: 'Open sans',
  backgroundColor: '#3B8487'
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