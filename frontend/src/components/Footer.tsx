import React from 'react';

export default function Footer() {
  return (
    <div className={'footer'}>
      <p>
        &copy; {new Date().getFullYear()} |{' '}
        <a href="https://yulian.codes">Yulian Kraynyak</a>
      </p>
    </div>
  );
}
