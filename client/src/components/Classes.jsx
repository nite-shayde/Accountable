import React from 'react';
// eslint-disable-next-line import/extensions
import ClassListItem from './ClassListItem.jsx';

/**
 * Classes is a stateless react component that displays a class list item for each class
 * @param {*} props - the passed down props (classList is an array prop)
 */

const Classes = props => (
  <div>
    <h4 display="inline-block">Your Current Classes</h4>
    <div>
      <h3>{props.classList.map(eachClass => <ClassListItem key={eachClass.name} teacherName={props.teacherName} eachClass={eachClass} />)}</h3>
    </div>
  </div>
);

export default Classes;
