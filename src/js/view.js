import { h } from 'hyperapp'
import { action } from '@hyperapp/fx'
import picostyle from 'picostyle'

const style = picostyle(h)

const black = '#000';
const white = '#fff';
const offWhite = '#e8e8e8';
const primaryColor = '#777';
const secondaryColor = '#aaa';
const tertiaryColor = '#ccc';
const bgColor = '#fff';
const baseFont = 'Helvetica Neue, sans-serif';
const headingFont = 'Fira Sans, sans-serif';

const Wrapper = style('div')({
  paddingTop: '50px',
  display: 'flex',
  fontFamily: baseFont,
  flexDirection: 'column',
  justifyContent: 'center'
})

const Swatch = style('div')(props => ({
  backgroundColor: `#${props.color}`,
  border: `1px solid ${black}`,
  width: '80px',
  height: '80px'
}))

const ColorItem = style('li')({
  alignItems: 'center',
  color: secondaryColor,
  display: 'flex',
  fontSize: '1.6em',
  justifyContent: 'space-between',
  margin: '20px',
})

const ColorList = style('ul')({
  margin: '0 auto',
  width: '400px',
  padding: '0'
})

const InputWrap = style('div')({
  display: 'flex',
  justifyContent: 'center'
})

const Input = style('input')({
  border: 'none',
  borderBottom: `2px solid ${secondaryColor}`,
  fontSize: '1em',
  width: '300px',
  height: '10px',
  padding: '10px',
  transition: 'all 0.4s',

  ":focus": {
    background: offWhite,
    outline: '0'
  }
})

const Button = style('button')(props => ({
  border: `2px solid ${secondaryColor}`,
  borderRadius: '8px',
  color: primaryColor,
  cursor: 'pointer',
  fontSize: `${ props.small ? '0.5em' : '1em' }`,
  marginLeft: '1em',
  transition: 'all 0.1s',

  ":focus": {
    outline: '0'
  },

  ":active": {
    color: black,
    background: offWhite
  }
}))

const Header = style('h1')({
  color: secondaryColor,
  cursor: 'default',
  fontSize: '4.2em',
  fontFamily: headingFont,
  marginBottom: '10px',
  textAlign: 'center',

  strong: {
    color: primaryColor
  }
})

const Subhead = style('p')({
  marginBottom: '20px',
  textAlign: 'center',

  a: {
    color: primaryColor,
    textDecoration: 'none',
    borderBottom: `2px solid ${primaryColor}`
  }
})

const Footer = style('div')({
  marginBottom: '80px'
})

const Color = ({ hex, remove }) => (
  <ColorItem id={hex} key={hex}>
    <Swatch color={hex} /> #{hex} <Button small title='Remove color' onclick={() => remove(hex)}>x</Button>
  </ColorItem>
)

const Source = ({ get, input, value, placeholder }) => (
  <InputWrap>
    <Input
      type='text'
      onkeyup={e => (e.keyCode === 13 ? get() : null)}
      oninput={e => input({ value: e.target.value })}
      value={value}
      placeholder={placeholder}
    />
    <Button title='Fetch palette' onclick={get}>Fetch</Button>
  </InputWrap>
)

const Output = ({ value, copy, copied }) => state => (
  <div>
    <Subhead>Here's your theme!</Subhead>
    <InputWrap>
      <Input
        class='js_copy'
        type='text'
        value={value}
        placeholder='Enjoy!'
      />
      <Button title='Copy to clipboard' onclick={copy}>{copied ? 'Copied!' : 'Copy'}</Button>
    </InputWrap>
  </div>
)

const view = (state, actions) => (
  <Wrapper>
    <Header>Firefox <strong>Color</strong>lovers</Header>
    <Subhead>Import one of over <a href='//colourlovers.com/palettes' target='_blank'>4,577,158</a> user-created color palettes to <a href='//color.firefox.com/'>colorize</a> your browser.</Subhead>
    <Source
      get={action('getPalette')}
      input={actions.input}
      value={state.sourceUrl}
      placeholder={state.placeholder}
    />
    <ColorList>
      {state.colors.map && state.colors.map(color => (
        <Color
          hex={color}
          remove={actions.remove}
        />
      ))}
    </ColorList>
    {state.outputUrl && <Output 
      value={state.outputUrl} 
      copy={actions.copy} 
      copied={state.copied} 
    />}
    <Footer />
  </Wrapper>
)

export default view
