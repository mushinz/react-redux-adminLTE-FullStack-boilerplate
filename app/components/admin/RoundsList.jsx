import React from 'react'
import Box from 'Box'
import { connect } from 'react-redux'
import { startGetAdminRounds, startDeleteRound, clearAdminRounds } from 'actions'

class RoundsList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { season, dispatch } = this.props
    if (season) {
      dispatch(startGetAdminRounds(season._id))
    } else {
      dispatch(clearAdminRounds())
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props
    const newSeason = nextProps.season
    const prevSeason = this.props.season
    // GET first data and refresh data if season is switched in the topbar
    if (newSeason !== prevSeason && !prevSeason) {
      return dispatch(startGetAdminRounds(newSeason._id))
    }
    return null
  }

  onDeleteRound(e, round) {
    e.stopPropagation()
    const { dispatch } = this.props
    if (round && round._id && confirm('You will lose all data of this rounds')) {
      dispatch(startDeleteRound(round._id))
    }
  }

  renderRoundList() {
    const { rounds } = this.props
    if (rounds && rounds.length) {
      /**
       * SORT BY LABEL
       */
      const sortedByRoundLabel = rounds.sort((a, b) => {
        if (a.label > b.label) {
          return 1
        }
        if (a.label < b.label) {
          return -1
        }
        return 0
      })
      /**
       * GENERATE LIST
       */
      return sortedByRoundLabel.map((round, i) => {
        let host = null, season = null
        if (round.host.length) {
          host = (
            <span className="product-description">
              <b>Host: </b> {round.host}
            </span>
          )
        }
        if (round.season.year) {
          season = (
            <span className="product-description">
              <b>Season: </b> {round.season.year}
            </span>
          )
        }
        return (
          <li className="item" key={i}>
            <div className="product-img round-host-img">
              <img src="dist/img/default-50x50.gif" role="presentation" />
            </div>
            <div className="product-info round-info">
              <span className="label label-danger pull-right">
                <i className="fa fa-remove fa-2x" onClick={(e) => this.onDeleteRound(e, round)}></i>
              </span>
              <span className="product-title">
                <b>Round: </b> {round.label}
              </span>
              {host}
              {season}
            </div>
          </li>
        )
      })
    }
    return (
      <p>
        No Round created yet!
      </p>
    )
  }


  render() {
    const { seasons } = this.props
    if (seasons.length) {
      return (
        <Box title="Rounds list">
          {JSON.stringify(this.props)}
          <ul className="products-list product-list-in-box">
            {this.renderRoundList()}
          </ul>
        </Box>
      )
    }
    return null
  }
}

RoundsList.propTypes = {
  seasons: React.PropTypes.array,
  season: React.PropTypes.object,
  rounds: React.PropTypes.array,
  dispatch: React.PropTypes.func,
}

export default connect((state) => ({
  seasons: state.seasons.seasons,
  season: state.seasons.viewed,
  rounds: state.rounds.rounds,
}))(RoundsList)
