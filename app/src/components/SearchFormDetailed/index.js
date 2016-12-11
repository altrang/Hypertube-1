import React			from 'react'
import lang				from '../../lang'

import IconClickable	from '../IconClickable'
import InputRange		from 'react-input-range'
import MenuItem			from 'material-ui/MenuItem'
import DropDownMenu		from 'material-ui/DropDownMenu'

import './sass/searchFormDetailed.sass'
import './sass/inputRange.sass'

const dropDownProps = {
	style: { width: '80%' },
	labelStyle: { color: 'white' },
	autoWidth: false,
}

export default class SearchFormDetailed extends React.Component {
	_mounted = false

	state = {
		yearValue: {
			min: 1900,
			max: 2016,
		},
		rateValue: {
			min: 0,
			max: 10,
		},
		catVal: 0,
		sortVal: 2,
		showAdvanced: false,
	}

	componentDidMount() {
		this._mounted = true
	}

	componentWillUnmount() {
		this._mounted = false
	}

	updateYear = (e, values) => this.setState({ yearValue: values }, this.props.onUpdate)
	updateRate = (e, values) => this.setState({ rateValue: values }, this.props.onUpdate)
	updateCat = (e, index, value) => this.setState({ catVal: value }, this.props.onUpdate)
	updateSort = (e, index, value) => this.setState({ sortVal: value }, this.props.onUpdate)

	showAdvanced = () => this.setState({ showAdvanced: !this.state.showAdvanced })

	generateCatList = () => lang.categories.map((el, key) =>
		<MenuItem value={key} key={key} primaryText={el[this.props.l]}
		label={`${lang.category[this.props.l]}: ${el[this.props.l]}`}/>)

	generateSortList = () => lang.sorts.map((el, key) =>
		<MenuItem key={key} value={key} primaryText={el[this.props.l]}
			label={`${lang.sortBy[this.props.l]} ${el[this.props.l]}`} />)

	render() {
		const { rateValue, yearValue, catVal, sortVal, showAdvanced } = this.state
		const { l } = this.props
		return (
			<div className="searchFormContainer">
				<IconClickable
					className={`moreButton ${showAdvanced ? 'reversed' : ''}`}
					click={this.showAdvanced}
				>
					<i className="material-icons">keyboard_arrow_down</i>
				</IconClickable>
				<form className={`searchFormDetailed ${!showAdvanced ? 'invisible' : ''}`}>
					<div className="selector">
						<span>{lang.year[l]}</span>
						<InputRange
							maxValue={2016}
							minValue={1900}
							value={yearValue}
							onChange={this.updateYear.bind(this)}
						/>
					</div>
					<div className="selector">
						<span>{lang.rating[l]}</span>
						<InputRange
							maxValue={10}
							minValue={0}
							value={rateValue}
							onChange={this.updateRate.bind(this)}
						/>
					</div>
					<DropDownMenu
						value={catVal}
						onChange={this.updateCat}
						{...dropDownProps}
					>
						{this.generateCatList()}
					</DropDownMenu>
					<DropDownMenu
						value={sortVal}
						onChange={this.updateSort}
						{...dropDownProps}
					>
						{this.generateSortList()}
					</DropDownMenu>
				</form>
			</div>
		)
	}
}
