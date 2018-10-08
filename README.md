# type-template

Simple, type-safe string interpolation

```typescript
// Import the tpl function and some default stringifiers
import tpl, { NUMBER, STRING } from 'type-template';

// Define a custom stringifier, a fancy name for a function mapping a value to a string
const DATE = (value: Date) => value.toLocaleString();

// Create a template
const myTemplate = tpl`Something ${{num:NUMBER}} something ${{myDate:DATE}} something ${{str:STRING}}`;

// myTemplate is now a function you can use for interpolation
const myString = myTemplate({
    // These arguments are all type-checked
    num: 96,
    myDate: new Date(),
    str: 'some other thing',
});

// -> 'Something 96 something 10/8/2018, 11:56:52 AM something some other thing'
```
