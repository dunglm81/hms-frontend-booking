import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={"footer " + styles.footerCustom}>
      <div className="content text-center">
        Hệ thống quản lý khách sạn Queen Hotel.
      </div>
    </footer>
  )
}
