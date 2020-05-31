import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastDisplay: 0,
      changeSreen: true,
      sign: "",
      dot: "",
      // making a formula
      firstNumber: null,
      operand: null,
      secondNumber: null,
    };
  }

  inputNumber(number) {
    let screenNumberLength = document
      .getElementById("screen")
      .innerText.split("");
    screenNumberLength = screenNumberLength.filter((e) => {
      return e !== "," && e !== ".";
    }).length;
    if (screenNumberLength <= 8) {
      // changing the screen
      let screenDisplay = this.state.changeSreen
        ? this.state.sign + number
        : this.state.sign +
          document.getElementById("screen").innerText +
          String(number);
      screenDisplay = screenDisplay.split("");
      screenDisplay = screenDisplay.filter((e) => {
        return e !== ",";
      });
      // convert to localestring
      screenDisplay = screenDisplay.join("");
      screenDisplay = screenDisplay.split(".");

      let localeString =
        screenDisplay.length > 1
          ? String(Number(screenDisplay[0]).toLocaleString()) +
            String(".") +
            screenDisplay[1].toLocaleString()
          : Number(screenDisplay[0]).toLocaleString();

      document.getElementById("screen").innerText = localeString;

      // updating a formula
      screenDisplay =
        screenDisplay.length > 1
          ? screenDisplay[0] + "." + screenDisplay[1]
          : screenDisplay[0];
      console.log(screenDisplay);

      if (this.state.operand === null) {
        this.setState({
          firstNumber: screenDisplay,
          changeSreen: false,
          sign: "",
        });
      } else if (this.state.operand !== null) {
        this.setState({
          secondNumber: screenDisplay,
          changeSreen: false,
          sign: "",
        });
      }
    } else if (this.state.operand !== null) {
      this.setState({ changeSreen: true });
      document.getElementById("screen").innerText = number;
    }
  }

  operate(operand) {
    let equation =
      this.state.firstNumber + this.state.operand + this.state.secondNumber;
    // if it formulates an equation already, computes it and store it in the first number
    if (
      this.state.firstNumber !== null &&
      this.state.operand !== null &&
      this.state.secondNumber !== null
    ) {
      let answer = eval(equation);
      document.getElementById("screen").innerText = Number(
        answer
      ).toLocaleString();
      this.setState({
        firstNumber: answer,
        secondNumber: null,
        changeSreen: true,
      });
    }
    this.setState({ changeSreen: true, operand: operand });
  }

  clearLastNumber() {
    // set the last element to be null
    // change the screen to display 0
    if (this.state.secondNumber !== null) {
      this.setState({ secondNumber: null, changeSreen: true });
    } else if (this.state.operand !== null) {
      this.setState({ operand: null, changeSreen: true });
    } else if (this.state.firstNumber !== null) {
      this.setState({ firstNumber: null, changeSreen: true });
    }
    document.getElementById("screen").innerText = 0;
  }

  plusMinus() {
    // changing the display
    // getting the display value that is in localeString and convert it back to number string
    let displayNumber = document.getElementById("screen").innerText.split("");
    displayNumber = displayNumber
      .filter((e) => {
        return e !== ",";
      })
      .join("");
    // evaluating the sign
    if (Math.sign(displayNumber) === 0 || Math.sign(displayNumber) === 1) {
      document.getElementById("screen").innerText =
        "-" + document.getElementById("screen").innerText;
    } else if (Math.sign(displayNumber) === -1) {
      document.getElementById("screen").innerText = Number(
        displayNumber * -1
      ).toLocaleString();
    }
    // updating the equation -- updating the last number
    let newNumber = document.getElementById("screen").innerText;
    if (this.state.secondNumber !== null) {
      this.setState({
        secondNumber: newNumber[0] + displayNumber,
        changeSreen: true,
      });
      document.getElementById("screen").innerText = Number(
        -1 * displayNumber
      ).toLocaleString();
    } else if (this.state.operand !== null) {
      this.setState({
        secondNumber: 0,
        changeSreen: true,
        sign: newNumber[0],
      });
      document.getElementById("screen").innerText = newNumber[0] + 0;
    } else if (this.state.firstNumber !== null) {
      this.setState({
        firstNumber: newNumber[0] + displayNumber,
        changeSreen: true,
      });
    }
  }

  toPercentage() {
    // first number though, change to percentage format
    let screenDisplay = document.getElementById("screen").innerText.split("");
    screenDisplay = screenDisplay
      .filter((e) => {
        return e !== ",";
      })
      .join("");
    if (this.state.firstNumber !== null && this.state.operand === null) {
      let percent = screenDisplay / 100;
      // change the screen
      document.getElementById("screen").innerText = percent;
      // change the equation
      this.setState({ firstNumber: percent });
    } else if (this.state.operand !== null) {
      let percent = eval(this.state.firstNumber * (screenDisplay / 100));
      document.getElementById("screen").innerText = percent;
      this.setState({ secondNumber: percent });
    }
    // percentage of the first number
  }

  evaluateEquation() {
    let screenDisplay = document.getElementById("screen").innerText;
    screenDisplay = screenDisplay.split("");
    screenDisplay = screenDisplay
      .filter((e) => {
        return e !== ",";
      })
      .join("");

    console.log(
      this.state.firstNumber + this.state.operand + Number(screenDisplay)
    );
    if (this.state.operand) {
      let answer = eval(
        String(this.state.firstNumber) +
          this.state.operand +
          Number(screenDisplay)
      );
      document.getElementById("screen").innerText = Number(
        answer
      ).toLocaleString();
      this.setState({ firstNumber: answer, secondNumber: null });
    }
  }

  render() {
    return (
      <div id="calculator">
        <Screen display={this.state.lastDisplay} />
        <Keyboard />
      </div>
    );
  }
}
// ================================================= Screen =================================================
class Screen extends React.Component {
  render() {
    return <div id="screen">{this.props.display}</div>;
  }
}
// ================================================= Keyboard =================================================
class Button extends Calculator {
  render() {
    return (
      <button
        className={this.props.className}
        id={this.props.id}
        onClick={() => this.props.onClick()}
      >
        {this.props.text}
      </button>
    );
  }
}

class Keyboard extends Calculator {
  // did not have a constructor that inherits the properties but somehow is able to access the function in the parent class?
  render() {
    return (
      <div id="keyboard">
        <Button
          text={this.state.firstNumber ? "C" : "AC"}
          id="AC-key"
          className="function-key"
          onClick={() => this.clearLastNumber()}
        />
        <Button
          text="+/-"
          className="function-key"
          onClick={() => this.plusMinus(-1)}
        />
        <Button
          text="%"
          className="function-key"
          onClick={() => this.toPercentage()}
        />
        <Button
          text="÷"
          className="operand-key"
          onClick={() => this.operate("/")}
        />

        <Button text="7" onClick={() => this.inputNumber(7)} />
        <Button text="8" onClick={() => this.inputNumber(8)} />
        <Button text="9" onClick={() => this.inputNumber(9)} />
        <Button
          text="×"
          className="operand-key"
          onClick={() => this.operate("*")}
        />

        <Button text="4" onClick={() => this.inputNumber(4)} />
        <Button text="5" onClick={() => this.inputNumber(5)} />
        <Button text="6" onClick={() => this.inputNumber(6)} />
        <Button
          text="-"
          className="operand-key"
          onClick={() => this.operate("-")}
        />

        <Button text="1" onClick={() => this.inputNumber(1)} />
        <Button text="2" onClick={() => this.inputNumber(2)} />
        <Button text="3" onClick={() => this.inputNumber(3)} />
        <Button
          text="+"
          className="operand-key"
          onClick={() => this.operate("+")}
        />

        <Button text="0" id="button-0" onClick={() => this.inputNumber(0)} />
        <Button text="." onClick={() => this.inputNumber(".")} />
        <Button
          text="="
          className="operand-key"
          onClick={() => this.evaluateEquation()}
        />
      </div>
    );
  }
}

ReactDOM.render(<Calculator />, document.getElementById("root"));
