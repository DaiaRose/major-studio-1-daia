/*
RiTa.js reference:
https://rednoise.org/rita/index.html#reference
*/
//how to do things that are not regex.

const myInput = document.querySelector('#myInput')

function getInput() {
  let input = myInput.value;
  processRita(input)
}

function processRita(input) {
  // change our input to a Rita string
  let rs = new RiString(input);

  // break our phrase into words:
  let words = rs.words();
  console.log(words);

  // get part-of-speech tags
  // part-of-speech tags list: https://rednoise.org/rita/reference/RiTa/pos/index.html
  let pos = rs.pos();
  console.log(pos);

  // change certain part-of-speech tags
  let output = '';
  words.forEach((word, i) => {
    // use regular expression to replace all nouns with random words pulled from RiTa
    // reference https://regexr.com/
    if (/nn/.test(pos[i])) {
      // if the word is a noun replace the word with a new noun:
      output += RiTa.randomWord(pos[i]) + ' ';//+= means outplus plus adding word
    } else {
      // if not, return the original word:
      output += word + ' ';
    }
  })

  // adding p elements with d3
  d3.select('#app')
    .append('p')//paragraph is always a new line
    .attr('class', 'rita-text')
    .text(output);
}
//this is a listener- not just button but also if press key
myInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    processRita(this.value);
  }
});