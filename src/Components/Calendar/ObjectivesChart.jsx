import React, { useState, useMemo, useContext } from 'react'

import { Chart } from 'react-charts'
import { Context } from '../State/Provider/Store';
import { month, weekday } from './AddMeal';

const ObjectivesChart = () => {
  const [state, ] = useContext(Context);
  const [caloriesData, setCaloriesData] = useState()
  const [nutrimentsData, setNutrimentsData] = useState()
  const [primaryCursorValue, setPrimaryCursorValue] = useState();
  const [secondaryCursorValue, setSecondaryCursorValue] = useState();

  const displayDate = (curDate, startingDate) => {
    let date = ``;
    if (curDate.getMonth().toString() !== startingDate.getMonth().toString() || curDate.getFullYear().toString() !== startingDate.getFullYear().toString())
      date = `${startingDate.getMonth() + 1}/`;
    date += `${startingDate.getDate()}`;
    if (curDate.getFullYear().toString() !== startingDate.getFullYear().toString())
      date += `/${startingDate.getFullYear()}`;
    return date;
  }

  const copyMatrix = (ref) => {
    let result = [];
    for (let i = 0; i < ref.length; i++) {
      result.push([...ref[i]]);
    }
    return result;
  }

  const stateToResult = useMemo(() => {
    
    const handleSetCalories = () => {

      let newData = [...state.result['balanceJourney']];
      let data = newData.map((result) => [`${month[result.date.getMonth()]}, ${result.date.getDate()} (${weekday[result.date.getDay()]})`, result['totalCalorie'] ? result['totalCalorie'] : 1]);

      let objectives = copyMatrix(data);
      for (let i = 0; i < objectives.length; i++) {
        objectives[i][1] = state.objectives.calories;
      }
      objectives.sort((a, b) => a[0] - b[0]);
      data.sort((a, b) => a[0] - b[0]);
      setCaloriesData([{label: 'Calories', data: [ ...data]} , {label: 'Goal', data: [['ref', 1], ...objectives]}]);
    }
    const handleSetNutriments = () => {
      console.log(state.result['balanceJourney']);
      let newData = [...state.result['balanceJourney']];
      
      let dataLipids = newData.map((result) => [`${month[result.date.getMonth()]}, ${result.date.getDate()} (${weekday[result.date.getDay()]})`, result['lipids'] ? result['lipids'] : 1]);
      let dataCarbs = newData.map((result) => [`${month[result.date.getMonth()]}, ${result.date.getDate()} (${weekday[result.date.getDay()]})`, result['carbs'] ? result['carbs'] : 1]);
      let dataProteins = newData.map((result) => [`${month[result.date.getMonth()]}, ${result.date.getDate()} (${weekday[result.date.getDay()]})`, result['proteins'] ? result['proteins'] : 1]);

      let objectivesLipids = copyMatrix(dataLipids);
      let objectivesCarbs = copyMatrix(dataCarbs);
      let objectivesProteins = copyMatrix(dataProteins);
      for (let i = 0; i < objectivesLipids.length; i++) {
        objectivesLipids[i][1] = 35;
        objectivesCarbs[i][1] = 50;
        objectivesProteins[i][1] = 15;
      }
      objectivesLipids.sort((a, b) => a[0] - b[0]);
      objectivesCarbs.sort((a, b) => a[0] - b[0]);
      objectivesProteins.sort((a, b) => a[0] - b[0]);
      dataLipids.sort((a, b) => a[0] - b[0]);
      dataCarbs.sort((a, b) => a[0] - b[0]);
      dataProteins.sort((a, b) => a[0] - b[0]);
      setNutrimentsData([
        {label: 'Lipids', data: [ ...dataLipids]} , {label: 'lipids goal', data: [...objectivesLipids]},
        {label: 'Carbs', data: [...dataCarbs]} , {label: 'carbs goal', data: [...objectivesCarbs]},
        {label: 'Proteins', data: [...dataProteins]} , {label: 'proteins goal', data: [['ref', 0.1], ...objectivesProteins]},
      ]);
    }
    handleSetCalories();
    handleSetNutriments();
  }, [state]);

  const dataCalories = useMemo(
  () => caloriesData ? [
    {
      label: caloriesData[0].label,
      data: caloriesData[0].data
    },
    {
      label: caloriesData[1].label,
      data: caloriesData[1].data
    }
  ] : [{label: 'none', data: [[0,0]]}],
  [caloriesData]
)
const dataNutriments = useMemo(
  () => nutrimentsData ? [
    {
      label: nutrimentsData[0].label,
      data: nutrimentsData[0].data
    },
    {
      label: nutrimentsData[1].label,
      data: nutrimentsData[1].data
    },
    {
      label: nutrimentsData[2].label,
      data: nutrimentsData[2].data
    },
    {
      label: nutrimentsData[3].label,
      data: nutrimentsData[3].data
    },
    {
      label: nutrimentsData[4].label,
      data: nutrimentsData[4].data
    },
    {
      label: nutrimentsData[5].label,
      data: nutrimentsData[5].data
    },
  ] : [{label: 'none', data: [[0,0]]}],
  [nutrimentsData]
)
const primaryCursor = React.useMemo(
  () => ({
    value: primaryCursorValue
  }),
  [primaryCursorValue]
)
const secondaryCursor = React.useMemo(
  () => ({
    value: secondaryCursorValue
  }),
  [secondaryCursorValue]
)

  const caloriesSeries = useMemo(
    () => ({
      type: 'bar'
    }),
    []
  )
  const nutrimentsSeries = useMemo(
    () => ({
      type: 'bar'
    }),
    []
  )
  const tooltip = React.useMemo(
    () => ({
      render: ({ datum, primaryAxis,getStyle }) => {
        return <CustomTooltip {...{ getStyle, primaryAxis, datum }} />
      }
    }),
    []
  )
  const customToolTipAxes = React.useMemo(
    () => [
      { primary: true, position: 'bottom', type: 'ordinal', maxLabelRotation: 1, spacing: 100},
      { position: 'left', type: 'linear', stacked: false, spacing: 100 }
    ],
    []
  )
  const axes = useMemo(
    () => [
      { primary: true, type: 'ordinal', position: 'bottom', maxLabelRotation: 1 },
      { position: 'left', type: 'linear', stacked: false}
    ],
    []
  )
  
  const onFocus = React.useCallback(datum => {
    setSecondaryCursorValue(datum ? datum.secondary : null);
    setPrimaryCursorValue(datum ? datum.primary : null);
  }, [])
  return (
    <div style={{justifyContent: 'center'}}>
      {(
      <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '12px',
        height: '300px',
      }}
    >
      <h2 style={{textAlign: 'center'}}>Periode: <span style={{color: 'blue'}}>{`${month[state.selectedDate.startingDate.getMonth()]} ${state.selectedDate.startingDate.getDate()} (${weekday[state.selectedDate.startingDate.getDay()]}) `}
       </span> to <span style={{color: 'green'}}> {`${month[state.result.date.getMonth()]}, ${state.result.date.getDate()} (${weekday[state.result.date.getDay()]})`}</span>
      </h2>
      <div
        style={{
          flex: '0 0 auto',
          padding: '10px',
        }}
      >
      </div>
      <div
        style={{
          flex: 2,
          maxHeight: '300px',
          margin: '10px'
        }}
      >
      <h2>Calories consumed (Kcal)</h2>
      <Chart data={dataCalories} onFocus={onFocus} series={caloriesSeries} primaryCursor={primaryCursor} secondaryCursor={secondaryCursor} axes={customToolTipAxes} tooltip={tooltip}/>
      <h2>Average nutriments in percentages</h2>
      <Chart data={dataNutriments} onFocus={onFocus} series={nutrimentsSeries} primaryCursor={primaryCursor} secondaryCursor={secondaryCursor} axes={axes} tooltip={tooltip}/>
       </div>
     </div>
  )}
    </div>
  )
}

function CustomTooltip({ getStyle, primaryAxis, datum }) {
  const data = React.useMemo(
    () =>
      datum
        ? [
            {
              data: datum.group.map(d => ({
                primary: d.series.label,
                secondary: d.secondary,
                color: getStyle(d).fill
              }))
            }
          ]
        : [],
    [datum, getStyle]
  )
  return datum ? (
    <div
      style={{
        color: 'white',
        pointerEvents: 'none'
      }}
    >
      <h3
        style={{
          display: 'block',
          textAlign: 'center'
        }}
      >
        {primaryAxis.format(datum.primary)}
      </h3>
      <div
        style={{
          width: '300px',
          height: '200px',
          display: 'flex'
        }}
      >
        <Chart
          data={data}
          dark
          series={{ type: 'bar' }}
          axes={[
            {
              primary: true,
              position: 'bottom',
              type: 'ordinal'
            },
            {
              position: 'left',
              type: 'linear'
            }
          ]}
          getDatumStyle={datum => ({
            color: datum.originalDatum.color
          })}
          primaryCursor={{
            value: datum.seriesLabel
          }}
        />
      </div>
    </div>
  ) : null
}
export default ObjectivesChart;