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

const Routes = ({}) => (
    <SVG height="1000" width="2000">
      <path className="path" d="M 10 10 l 90 0 l 90 60" fill="transparent" stroke="red" pathLength="1"/>
      <path className="path" d="M 70 10 l 240 0" stroke="black" fill="transparent" stroke="red" pathLength="1"/>
      <path className="path" d="M 10 70 l 300 0" stroke="black" fill="transparent" stroke="red" pathLength="1"/>
    </SVG>
);

const Collision = ({ collision_path, line_stroke , train}) => (

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
      xIsNext: true,
      isConflict: false,
    };
  }

  handleToggleClick(i) {
    console.log(this.state.isConflict)

    if (this.state.isConflict) {
      
      this.setState({
        xIsNext: !this.state.xIsNext,
        isConflict: false,
      });
    } else {

      this.setState({
        xIsNext: !this.state.xIsNext,
        isConflict: true,
        collisionMeta: 
        [
          {
            headcode: "1A11",
            path: "M 10 10 l 90 0 l 90 60 l 90 0",
            hash: "1000",
            line_stroke: "#FF0099"
          },
          {
            headcode: "2A22",
            path: "M 10 70 l 300 0",
            hash: "2000",
            line_stroke: "#E6FB04"
          }
        ]
      });

    }
  }

  priorityClick() {
    console.log('clicked')
    this.setState({
      ...this.state,
      
    })
  }

  createVisualsForCollisions = (collisions) => {
    console.log(collisions.length)

    return collisions.map((collision) => {
      return (
      <div className="collision">
        <Collision collision_path={collision.path} line_stroke={collision.line_stroke} train={collision.headcode} collision_hash={collision.hash}/>
      </div>)
    })

  }

  render() {

    const currentConflictState = this.state.isConflict;

    if (currentConflictState) {
    return (
      <div className="game">

         <div className="toggle">
            <Detection onClick={i => this.handleToggleClick(i)} />
          </div>

        <div className="path">
          <Routes />
        </div>

        {this.createVisualsForCollisions(this.state.collisionMeta)}

        {/* <div className="collision">
          <Collision collision_path="M 10 10 l 90 0 l 90 60 l 90 0" line_stroke="#FF0099" train="2A22" collision_hash="1000"/>
        </div>
        <div className="collision">
          <Collision collision_path="M 10 70 l 300 0" line_stroke="#E6FB04" train="1A11" collision_hash="2000"/>
        </div> */}

        <button className="priorityButton" onClick={this.priorityClick}>Prioritise 2A22</button>
        <button className="priorityButton" onClick={this.priorityClick} >Prioritise 1A11</button>
      </div>
      );
    } else {
      return (
        <div className="game">
          <div className="toggle">
            <Detection onClick={i => this.handleToggleClick(i)} />
          </div>
          <div className="path">
            <Routes />
          </div>
        </div>
      );
  }
}
}
  
  // ========================================
  
ReactDOM.render(<Application />, document.getElementById("root"));
