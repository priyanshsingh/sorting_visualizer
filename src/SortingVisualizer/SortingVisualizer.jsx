import React from 'react';
import { getMergeSortAnimations } from '../sortingAlgorithms/sortingAlgos';
import './SortingVisualizer.css';

// Change this value for the speed of the animations.
const ANIMATION_SPEED_MS = 15;

// Change this value for the number of bars (value) in the array.
const NUMBER_OF_ARRAY_BARS = 26;

// This is the main color of the array bars.
const PRIMARY_COLOR = "#03045e";

// This is the color of array bars that are being compared throughout the animations.
const SECONDARY_COLOR = '#00b4d8';

export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      array: [],
    };
  }

  componentDidMount() {
    this.resetArray();
  }

  resetArray() {
    const array = [];
    for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
      array.push(randomIntFromInterval(5, 500));
    }
    this.setState({ array });
  }

  mergeSort() {
    const animations = getMergeSortAnimations(this.state.array);
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 3 !== 2;
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
        setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * ANIMATION_SPEED_MS);
      } else {
        setTimeout(() => {
          const [barOneIdx, newHeight] = animations[i];
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${newHeight}px`;
        }, i * ANIMATION_SPEED_MS);
      }
    }
  }

  bubbleSort() {
    const array = this.state.array.slice();
    const animations = [];
    const n = array.length;
  
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        animations.push([j, j + 1, 'comparison']);
        if (array[j] > array[j + 1]) {
          animations.push([j, j + 1, 'swap']);
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }
  
    const arrayBars = document.getElementsByClassName('array-bar');
    const startTime = performance.now();
    for (let i = 0; i < animations.length; i++) {
      const [barOneIdx, barTwoIdx, type] = animations[i];
      const barOneStyle = arrayBars[barOneIdx].style;
      const barTwoStyle = arrayBars[barTwoIdx].style;
      const color = type === 'swap' ? SECONDARY_COLOR : PRIMARY_COLOR;
  
      setTimeout(() => {
        barOneStyle.backgroundColor = color;
        barTwoStyle.backgroundColor = color;
  
        if (type === 'swap') {
          const temp = barOneStyle.height;
          barOneStyle.height = barTwoStyle.height;
          barTwoStyle.height = temp;
        }
        if (i === animations.length - 1) {
          const endTime = performance.now();
          const timeTaken = endTime - startTime;
          console.log('Time taken to execute animations: ' + timeTaken + ' milliseconds');
        }
      }, i * ANIMATION_SPEED_MS);
    }
  }
  
  


  heapSort() {
    const array = this.state.array.slice();
    const animations = [];
    let n = array.length;

    // Build heap (rearrange array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
      this.heapify(array, n, i, animations);

    // One by one extract an element from heap
    for (let i = n - 1; i >= 0; i--) {
      // Move current root to end
      animations.push([0, i, 'swap']);
      let temp = array[0];
      array[0] = array[i];
      array[i] = temp;

      // call max heapify on the reduced heap
      this.heapify(array, i, 0, animations);
    }

    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const [barOneIdx, barTwoIdx, type] = animations[i];

      const barOneStyle = arrayBars[barOneIdx].style;
      const barTwoStyle = arrayBars[barTwoIdx].style;
      const color = type === 'swap' ? SECONDARY_COLOR : PRIMARY_COLOR;

      setTimeout(() => {
        barOneStyle.backgroundColor = color;
        barTwoStyle.backgroundColor = color;

        if (type === 'swap') {
          const temp = barOneStyle.height;
          barOneStyle.height = barTwoStyle.height;
          barTwoStyle.height = temp;
        }
      }, i * ANIMATION_SPEED_MS);
    }
  }

  heapify(array, n, i, animations) {
    let largest = i; // Initialize largest as root
    let l = 2 * i + 1; // left = 2*i + 1
    let r = 2 * i + 2; // right = 2*i + 2

    // If left child is larger than root
    if (l < n && array[l] > array[largest])
      largest = l;

    // If right child is larger than largest so far
    if (r < n && array[r] > array[largest])
      largest = r;

    // If largest is not root
    if (largest !== i) {
      animations.push([i, largest, 'comparison']);
      animations.push([i, largest, 'swap']);
      let swap = array[i];
      array[i] = array[largest];
      array[largest] = swap;

      // Recursively heapify the affected sub-tree
      this.heapify(array, n, largest, animations);
    }
  }



  quickSort() {
    const array = this.state.array.slice();
    const animations = [];
    const start = performance.now();
    
    function partition(startIdx, endIdx) {
      let pivotIdx = startIdx;
      let leftIdx = startIdx + 1;
      let rightIdx = endIdx;
  
      while (rightIdx >= leftIdx) {
        animations.push([pivotIdx, rightIdx, 'comparison']);
        animations.push([pivotIdx, leftIdx, 'comparison']);
  
        if (array[rightIdx] < array[pivotIdx] && array[leftIdx] > array[pivotIdx]) {
          animations.push([leftIdx, rightIdx, 'swap']);
          let temp = array[leftIdx];
          array[leftIdx] = array[rightIdx];
          array[rightIdx] = temp;
        }
        
        if (array[rightIdx] >= array[pivotIdx]) {
          animations.push([pivotIdx, rightIdx, 'revert']);
          rightIdx--;
        }
  
        if (array[leftIdx] <= array[pivotIdx]) {
          animations.push([pivotIdx, leftIdx, 'revert']);
          leftIdx++;
        }
      }
  
      animations.push([pivotIdx, rightIdx, 'swap']);
      let temp = array[pivotIdx];
      array[pivotIdx] = array[rightIdx];
      array[rightIdx] = temp;
  
      return rightIdx;
    }
  
    function quickSortHelper(startIdx, endIdx) {
      if (startIdx >= endIdx) return;
  
      let pivotIdx = partition(startIdx, endIdx);
  
      quickSortHelper(startIdx, pivotIdx - 1);
      quickSortHelper(pivotIdx + 1, endIdx);
    }
  
    quickSortHelper(0, array.length - 1);
  
    const end = performance.now();
    const time = end - start;
    console.log(`Time taken to sort array: ${time} milliseconds`);
  
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const [barOneIdx, barTwoIdx, type] = animations[i];
  
      const barOneStyle = arrayBars[barOneIdx].style;
      const barTwoStyle = arrayBars[barTwoIdx].style;
      const color = type === 'swap' ? SECONDARY_COLOR : PRIMARY_COLOR;
  
      setTimeout(() => {
        barOneStyle.backgroundColor = color;
        barTwoStyle.backgroundColor = color;
  
        if (type === 'swap') {
          const temp = barOneStyle.height;
          barOneStyle.height = barTwoStyle.height;
          barTwoStyle.height = temp;
        }
      }, i * ANIMATION_SPEED_MS);
    }
  }
  
  







  render() {
    const { array } = this.state;

    return (
      <>
        <nav className="navbar">
          <div className="navbar-container">
            <ul className="navbar-menu">

              <li className="navbar-item">
                <button className="navbar-button" onClick={() => this.mergeSort()}>Merge Sort</button>
              </li>
              <li className="navbar-item">
                <button className="navbar-button" onClick={() => this.quickSort()}>Quick Sort</button>
              </li>
              <li className="navbar-item">
                <button className="navbar-button" onClick={() => this.heapSort()}>Heap Sort</button>
              </li>
              <li className="navbar-item">
                <button className="navbar-button" onClick={() => this.bubbleSort()}>Bubble Sort</button>
              </li>
              <li className="navbar-item">
                <button className="navbar-button" onClick={() => window.location.reload()}>Reset array</button>
              </li>
              <li className="navbar-heading">
                <span>S</span>
                <span>o</span>
                <span>r</span>
                <span>t</span>
                <span>i</span>
                <span>n</span>
                <span>g</span>
                <span> </span>
                <span>V</span>
                <span>i</span>
                <span>s</span>
                <span>u</span>
                <span>a</span>
                <span>l</span>
                <span>i</span>
                <span>z</span>
                <span>e</span>
                <span>r</span>

              </li>
              <li className="navbar-item">
                <button className="navbar-button1" onClick={() => this.resetArray()}>Generate new array</button>
              </li>

            </ul>
          </div>
        </nav>
        <div className="array-container">
          {array.map((value, idx) => (
            <div
              className="array-bar"
              key={idx}
              style={{
                backgroundColor: PRIMARY_COLOR,
                height: `${value}px`,
              }}></div>
          ))}
        </div>
      </>
    );
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// function arraysAreEqual(arrayOne, arrayTwo) {
//   if (arrayOne.length !== arrayTwo.length) return false;
//   for (let i = 0; i < arrayOne.length; i++) {
//     if (arrayOne[i] !== arrayTwo[i]) {
//       return false;
//     }
//   }
//   return true;
// }