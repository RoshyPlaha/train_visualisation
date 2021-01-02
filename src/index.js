import React from 'react';
import ReactDOM from 'react-dom';
import SVG from 'react-svg-draw'
import './index.css';
import Helmet from 'react-helmet'

function Detection(props) {
  return (
    <button onClick={props.onClick}>
    </button>
  )
}

function ButtonReset(props) {
  return <button key="reset" className="resetButton" onClick={props.onClick}>Reset Priority</button>
}

function ButtonPriority(props) {
  return <button key={props.headcode} className="priorityButton" onClick={props.onClick}>Prioritise {props.headcode}</button>
}

const Routes = ({}) => (
    <SVG height="1000" width="2000">
      <path className="path" d="M 10 10 l 90 0 l 90 60" fill="transparent" stroke="red" pathLength="1"/>
      <path className="path" d="M 70 10 l 240 0" stroke="black" fill="transparent" stroke="red" pathLength="1"/>
      <path className="path" d="M 10 70 l 300 0" stroke="black" fill="transparent" stroke="red" pathLength="1"/>
    </SVG>
);

const Collision = ({ collision_path, line_stroke }) => (

    <div>
      <SVG height="210" width="500">

      <svg viewBox="0 0 400 400">
      <defs>
          <filter id="red-glow" filterUnits="userSpaceOnUse"
                  x="-50%" y="-50%" width="200%" height="200%">
            {/* <!-- blur the text at different levels--> */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur5"/>
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur10"/>
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur20"/>
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur30"/>
            <feGaussianBlur in="SourceGraphic" stdDeviation="50" result="blur50"/>

            <feMerge result="blur-merged">
              <feMergeNode in="blur10"/>
              <feMergeNode in="blur20"/>
              <feMergeNode in="blur30"/>
              <feMergeNode in="blur50"/>
            </feMerge>
            {/* <!-- recolour the merged blurs red--> */}
            <feColorMatrix result="red-blur" in="blur-merged" type="matrix"
                          values="1 0 0 0 0
                                  0 0.06 0 0 0
                                  0 0 0.44 0 0
                                  0 0 0 1 0" />
            <feMerge>
              <feMergeNode in="red-blur"/>       
              <feMergeNode in="blur5"/>         
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        </svg>
        <path className="collision" d={collision_path} fill="transparent" stroke={line_stroke} pathLength="1"/>
      </SVG>
  </div>
);
 

class Application extends React.Component {
  render () {
    return (
        <div className="application"> 
            <Helmet>
                <style>{'body { background-color: black; }'}</style>
            </Helmet>
            <Game/>
        </div>
    );
  }
};
  
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

  priorityClick(headcode) {
    let expandedState = { ...this.state };
    console.log('clicked ' + JSON.stringify(expandedState));


    expandedState.collisionMeta.forEach((collision) => {
      console.log(headcode + ' ' + collision.headcode)
      if (collision.headcode === headcode) {
        collision.userSelected = true
      } else {
        collision.userSelected = false
      }
    })


    this.setState({
      ...expandedState,
      isConflict: true,
    })

    console.log('new state: ' + this.state)

  }

  createVisualsForCollisions = (collisions) => {

    return collisions.map((collision) => {
      return (
      <div key={collision.hash} className="collision">
        <Collision key={collision.hash} collision_path={collision.path} line_stroke={collision.line_stroke} train={collision.headcode} collision_hash={collision.hash}/>
      </div>)
    })
  }

  isAnyPreferenceSelected = () => {
    
    let selected_train_collision;
    this.state.collisionMeta.forEach((collision) => {
      if (collision.userSelected) {
        console.log('found a match: ' + collision.headcode)
        selected_train_collision =  collision;
      }
    });

    return selected_train_collision;
  }

  createButtonsForCollisions = (collisions) => {

    let collisionButton =  collisions.map((collision) => {
      return (
       <ButtonPriority key={collision.headcode} headcode={collision.headcode} onClick={() => this.priorityClick(collision.headcode)} />
      )
    });

    return collisionButton;
  }

  resetButtonForCollisions = () => {
    const expandedState = {...this.state};

    expandedState.collisionMeta.forEach((collision) => {
      collision.userSelected = false;
    });

    this.setState({
      ...expandedState,
      isConflict: true,
    })
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

          <div className="toggle">
              <Detection onClick={i => this.handleToggleClick(i)} />
            </div>

          <div className="path">
            <Routes />
          </div>

          {this.renderConflictState(this.state.isConflict)}

        </div>
      );
  }
}
  
  // ========================================
  
ReactDOM.render(<Application />, document.getElementById("root"));
