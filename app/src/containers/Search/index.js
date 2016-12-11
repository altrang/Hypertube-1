import React						from 'react'
import { connect }					from 'react-redux'
import _							from 'lodash'
import { goMoviePage, bIn }			from '../../action/body'
import lang							from '../../lang'
import api							from '../../apiCall'

import LinearProgress				from 'material-ui/LinearProgress'
import InfiniteScroll				from 'react-infinite-scroller'
import SearchFormDetailed			from '../../components/SearchFormDetailed'
import MiniMovie					from '../../components/MiniMovie'

import './sass/search.sass'

const linearStyle = {
	width: '50%',
	margin: 'auto'
}

class Search extends React.Component {
	_mounted = false

	state = {
		results: [],
		serverStatus: null,
		pending: true,
		noResults: false,
		more: false,
		page: 0,
	}

	_form = null

	componentDidMount() {
		this._mounted = true
		this.loadMore = _.debounce(this.loadMore, 300)
		const { minyear, maxyear, minrate, maxrate, category, sort } = this.props.location.query
		this.requestFilms(false, { params: {
			title: this.props.location.query.title || '',
			minYear: minyear || 1900,
			maxYear: maxyear || 2016,
			minRate: minrate || 0,
			maxRate: maxrate || 10,
			category: category || 'all',
			sort: sort || 'year',
			page: 0,
		} })
		this.props.dispatch(bIn())
	}

	componentWillUnmount() {
		this._mounted = false
	}

	requestFilms = async (clearRes, reqSet) => {
		this.setState({ pending: true })
		const { data } = await api.search(reqSet)
		if (!data.status) {
			this.setState({ pending: false })
			return false
		}
		if (data.status.includes('success')) {
			this.setState({
				results: clearRes ? data.results : [...this.state.results, ...data.results],
				noResults: false,
				pending: false,
				more: data.results.length === 20
			})
		} else {
			this.setState({
				noResults: true,
				results: [],
				pending: false,
				more: false
			})
		}
	}

	componentWillReceiveProps = (newProps) => {
		if (!this._form) return false
		const {
			yearValue,
			rateValue,
			catVal,
			sortVal
		} = this._form.state

		this.requestFilms(true, { params: {
			title: newProps.location.query.title,
			page: 0,
			minYear: yearValue.min,
			maxYear: yearValue.max,
			minRate: rateValue.min,
			maxRate: rateValue.max,
			category: lang.categories[catVal][0],
			sort: lang.sorts[sortVal][0],
		} })
	}

	drawResults = () => {
		const { results } = this.state
		return results.map((result, key) =>
			<MiniMovie data={result} key={key} click={() => goMoviePage(result.id, this.props.dispatch)} />
		)
	}

	loadMore = () => {
		if (!this._form.state) return false
		const { page, noResults, more } = this.state
		const { yearValue, rateValue, catVal, sortVal } = this._form.state
		const nextPage = page + 1

		if (noResults || !more) return false
		this.requestFilms(false, { params: {
			title: this.props.location.query.title,
			page: nextPage,
			minYear: yearValue.min,
			maxYear: yearValue.max,
			minRate: rateValue.min,
			maxRate: rateValue.max,
			category: lang.categories[catVal][0],
			sort: lang.sorts[sortVal][0],
		} })
		this.setState({ page: nextPage })
	}

	formUpdate = () => {
		const {
			yearValue,
			rateValue,
			catVal,
			sortVal,
		} = this._form.state
		this.requestFilms(true, { params: {
			title: this.props.location.query.title,
			page: 0,
			minYear: yearValue.min,
			maxYear: yearValue.max,
			minRate: rateValue.min,
			maxRate: rateValue.max,
			category: lang.categories[catVal][0],
			sort: lang.sorts[sortVal][0],
		} })
	}

	render() {
		const { l, mainColor } = this.props
		const { noResults, pending, more } = this.state
		return (
			<div className="comp searchComp">
				{(pending &&
					<LinearProgress
						key={1}
						mode="indeterminate"
						color={mainColor}
						style={linearStyle}
					/>)
						||
					<LinearProgress
						key={2}
						mode="determinate"
						value={0}
						color={mainColor} style={linearStyle}
					/>
				}
				<SearchFormDetailed
					l={l}
					ref={(form) => this._form = form}
					onUpdate={this.formUpdate}
				/>
				<h3 className="resultsStatus">{noResults ? lang.noResultsFound[this.props.l] : null}</h3>
				<InfiniteScroll
					pageStart={0}
					loadMore={this.loadMore}
					hasMore={more}
					className="resultsContainer"
					threshold={500}
				>
					{this.drawResults()}
				</InfiniteScroll>
			</div>
		)
	}
}

const mapStateToProps = ({ lang, theme }) => ({
	l: lang.l,
	mainColor: theme.mainColor,
})

export default connect(mapStateToProps)(Search)
