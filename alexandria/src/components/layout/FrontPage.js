import React from 'react'
import { ViewHeader } from '../common/alexandriaComponents'
import { Row, Col } from 'react-bootstrap'
import GraphContainer from '../graphs/GraphContainer'
import KPIContainer from '../graphs/KPIContainer'
import BookCountByCategoryPie from '../books/BookCountByCategoryPie'
import BookCountByStatusPie from '../books/BookCountByStatusPie'

const mainHeaderStyle = {
  color: 'white',
  fontFamily: 'sans-serif',
  marginLeft: 10,
  textAlign: 'center'
}

const infoStyle = {
  color: 'white',
  backgroundColor: 'rgb(98,161,164',
  margin: 10,
  padding: 20,
  borderRadius: 4,
  fontFamily: 'sans-serif'
}

const chartLabelStyle = {
  labels: {
    fill: 'white'
  }
}

const getCategoryPie = stats => {
  if (stats) {
    return (
      <BookCountByCategoryPie
        key={1}
        data={stats.categoryCounts}
        style={chartLabelStyle}
      />
    )
  } else {
    return (
      <div></div>
    )
  }
}

const getStatusPie = stats => {
  const statuses = []
  if (stats) {
    if (stats.unread) {
      statuses.push({ name: 'Not read yet', count: stats.unread })
    }
    if (stats.started) {
      statuses.push({ name: 'Part way through', count: stats.started })
    }
    if (stats.finished) {
      statuses.push({ name: 'Read', count: stats.finished })
    }
  }

  return (
    <BookCountByStatusPie
      key={2}
      data={statuses}
      style={chartLabelStyle}
    />
  )
}

const FrontPage = ({ currentUser, stats }) => {
  const categoryPieCall = () => getCategoryPie(stats)
  const statusPieCall = () => getStatusPie(stats)

  return (
    <div>
      {
        currentUser &&
        <div>
          <ViewHeader
            text='Library dashboard'
          />
          {
            stats &&
            <Row style={{ margin: 10 }}>
              <Col sm={9} style={{ padding: 0 }}>
                <GraphContainer
                  getCharts={[
                    {
                      title: 'Books in main categories',
                      call: categoryPieCall
                    },
                    {
                      title: 'Books by reading status',
                      call: statusPieCall
                    }
                  ]}
                  style={{ margin: 10 }}
                  inverted={true}
                />
              </Col>
              <Col sm={3}>

              </Col>
            </Row>
          }
        </div>
      }
      {
        !currentUser &&
        <div>
          <div style={mainHeaderStyle}>
            <h1>ALEXANDRIA</h1>
            <h2>Managing your personal library</h2>
          </div>
          <div style={infoStyle}>
            You are not currently logged in. Please log in to access your library.
          </div>
        </div>
      }
    </div>
  )
}

export default FrontPage