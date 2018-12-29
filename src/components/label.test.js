import React from 'react'
import renderer from 'react-test-renderer'
import Label from './label'

describe('Label', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Label>Some Text</Label>).toJSON()
    expect(tree).toMatchInlineSnapshot(`
<div
  style={
    Object {
      "fontStyle": "bold",
    }
  }
>
  Some Text
</div>
`)
  })
})
