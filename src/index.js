import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import './index.css';
import Helmet from 'react-helmet'
import CanvasJSReact from './canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function ButtonReset(props) {
  return  (<a key="reset" className="resetButton" href="#" onClick={props.onClick}>
  Reset Priority 
</a>)
}

class Graph extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        range: {
          lowRange: new Date(2016, 0, 25, 18, 31),
          highRange: new Date(2016, 0, 26, 0, 0) // highRange: new Date(2016, 0, 27, 17, 0)

        },
        data: [
          {        
            type: "line",
            name: "1A11",
            showInLegend: true,
            dataPoints:  [
              { label: "BRIGHTN", y: (new Date(2016, 0, 25, 18, 30)).getTime() },
              { label: "PRSP", y: (new Date(2016, 0, 26, 12, 1)).getTime() },
              { label: "HYWRDS", y: (new Date(2016, 0, 26, 3, 3)).getTime(), markerColor: "red", markerType: "circle", markerSize: 20 },
              { label: "HSSKS", y: (new Date(2016, 0, 26, 6, 1)).getTime() },
              { label: "BLCMB", y: (new Date(2016, 0, 26, 9, 1)).getTime() },
              { label: "THBRDGS", y: (new Date(2016, 0, 26, 14, 1)).getTime() },
              { label: "GTWCK", y: (new Date(2016, 0, 26, 17, 0)).getTime() },
              { label: "HRLEY", y: (new Date(2016, 0, 26, 20, 1)).getTime() },
              { label: "ECRYDN", y: (new Date(2016, 0, 26, 23, 2)).getTime() }
            ]
          },
          {        
            type: "line",
            name: "3L44",
            showInLegend: true,
            dataPoints:  [
              { label: "BRIGHTN", y: (new Date(2016, 0, 25, 22, 30)).getTime() },
              { label: "PRSP", y: (new Date(2016, 0, 26, 13, 1)).getTime() },
              { label: "HYWRDS", y: (new Date(2016, 0, 26, 3, 3)).getTime(),markerColor: "red", markerType: "circle", markerSize: 20 },
              { label: "GTWCK", y: (new Date(2016, 0, 26, 14, 0)).getTime() },
              { label: "ECRYDN", y: (new Date(2016, 0, 26, 17, 0)).getTime() }  
            ]
          }
        ]
      }
  }

  render() {
    
    console.log('they rendered me again!')
    const options = {
      title:{
        text: "Train Graph"
      },

      axisY: {
        title: "Time",
        minimum: this.state.range.lowRange.getTime() + (200 * 60000), //(new Date(2016, 0, 25, 17, 30)).getTime(),    
        maximum: this.state.range.highRange.getTime() - (60 * 60000), // need to add mire buffer here    
        labelFormatter: function(e){
          return CanvasJS.formatDate(e.value, "DD-MMM hh:mm TT");
        }
      },
      axisX:{
        title: "Tiplocs",
        gridThickness: 2
      },
      data: this.state.data
    }

   return (
     <div>
       <CanvasJSChart options={options}
       onRef = {ref => this.chart = ref}
       />
      <NavigationUp onClick={() => this.loadMoreDataTwo(2)} />
     </div>
   )
  }

  loadMoreDataTwo(hours) {
    const low = this.state.range.lowRange;
    const high = this.state.range.highRange;

    const shifted_low = new Date(low.setHours(low.getHours()+hours))
    const shifted_high = new Date(high.setHours(high.getHours()+hours))

    this.setState({
      ...this.state,
      range: {
        lowRange: shifted_low,
        highRange: shifted_high
      }
    })

    console.log(JSON.stringify(this.state.range.lowRange.getTime()))
  }

  loadMoreData(hours) {

    const low = this.state.range.lowRange;
    const high = this.state.range.highRange;

    const shifted_low = low.setHours(low.getHours()+hours)
    const shifted_high = high.setHours(high.getHours()+hours)

    console.log('shifted low: ' + new Date(shifted_low))
    console.log('shifted high: ' + new Date(shifted_high))

    const trains = this.state.data

    const new_train_set = []
    trains.forEach((train) => {
      const new_train = {
        type: train.type,
        name: train.name,
        showInLegend: train.showInLegend,
        dataPoints: []
      }

      new_train.dataPoints.push(train.dataPoints.filter((trainStop) => {
        if (trainStop.y > low && trainStop.y <= high) {
          trainStop.y = new Date(trainStop.y).toTimeString()
          return trainStop
        } else {
          console.log('out of range')
        }
      }));

      new_train_set.push(new_train)
    })

    console.log("hi: " + JSON.stringify(new_train_set))
    this.setState(new_train_set)
  }
}

const NavigationUp = (props) => {
  return (
    <button onClick={props.onClick}>+ 2 hours</button>
  )
}


class Application extends React.Component {
  render () {
    return (
        <div className="application"> 
            <Helmet>
                <style>{'body { background-color: black; }'}</style>
            </Helmet>

            <Graph/>
        </div>
    );
  }
};


class ConflictTable extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        alternatives: [],
        problemStatement: [],
        journeyDetails: [],
        collisionMetaData: {}
      }

  }

  componentDidMount() {
    
    axios.get(`http://127.0.0.1:5000/?panel=6`)
      .then(res => {
        const alternatives = res.data.alternatives;
        const problemStatement = res.data.problem_statement;
        const journeyDetails = res.data.problem_statement.journey_details;
        const collisionMetaData = res.data.collison_metadata;
        // console.log(journeyDetails)
        this.setState({ 
            problemStatement: problemStatement,
            alternatives: alternatives,
            journeyDetails: journeyDetails,
            collisionMetaData: collisionMetaData,
          });
      })
  }

  render() {
    return (
        <div>
          <h2>Panel: 6</h2>
          <h3>Problem </h3>
          <h4> <ul> Trains {JSON.stringify(this.state.collisionMetaData.trains)} near {this.state.collisionMetaData.closest_tiploc} share routes {JSON.stringify(this.state.collisionMetaData.shared_routes)} 12:03:00 </ul></h4>
          <h3>Solutions</h3>
          <ul>
            { this.state.alternatives.map(alt => <li key={alt.alternative_id}><p>Preference {alt.alternative_preference} is {alt.Solution.metadata.methodology} {alt.Solution.journey_details[0].headcode} saving {alt.Solution.metadata.savedTime}</p></li>)}
          </ul>
        </div>
      )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepNumber: 0,
      isConflict: false,
    };
  }

  handleToggleClick(i) {
    console.log(this.state.isConflict)

    if (this.state.isConflict) {
      
      this.setState({
        isConflict: false,
      });
    } else {

      this.setState({
        isConflict: true,
        collisionMeta: 
        [
          {
            headcode: "1A11",
            path: "M 10 10 l 90 0 l 90 60 l 90 0",
            hash: "1000",
            line_stroke: "#FF0099",
            userSelected: false,
          },
          {
            headcode: "2A22",
            path: "M 10 70 l 300 0",
            hash: "2000",
            line_stroke: "#E6FB04",
            userSelected: false,
          }
        ]
      });

    }
  }

  renderConflictState = (isConflictState) => {
    let c = []
    if (isConflictState) {

      // have any of the options been pressed, if so only render those. if not render all visuals for all lines
      const trainPreference = this.isAnyPreferenceSelected();

      if (trainPreference != null)  {
        const x = []
        x.push(trainPreference)
        console.log('selected collision is: ' + JSON.stringify(x));
        c.push(this.createVisualsForCollisions(x))
        c.push(this.createButtonsForCollisions(this.state.collisionMeta, this.priorityClick))

      } else {
        c.push(this.createVisualsForCollisions(this.state.collisionMeta))
        c.push(this.createButtonsForCollisions(this.state.collisionMeta, this.priorityClick))
      }

      // always allow the reset option
      c.push(<ButtonReset key="reset" onClick={() => this.resetButtonForCollisions()}/>)
      return c;
    }
  }

  render() {

      return (
        <div className="game">

          {/* <div className="toggle">
              <Detection onClick={i => this.handleToggleClick(i)} />
            </div>

          <div className="path">
            <Routes />
          </div> */}

          {this.renderConflictState(this.state.isConflict)}
        </div>
      );
  }
}
  
  // ========================================
  
ReactDOM.render(<Application />, document.getElementById("root"));
