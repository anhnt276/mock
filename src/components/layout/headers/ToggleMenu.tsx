import { Button } from "react-bootstrap";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useState } from "react";

export const ToggleMenu = ({ menuItems }: any) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  }
  const handleOnSelect = () => {
    setCollapsed(false)
  }
  
  return (
    <div>
      <Button 
        className="d-flex justify-content-center min-w-30 mr-2" 
        variant="success" onClick={toggleCollapsed}
      >
        {collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
      </Button>
      {collapsed && 
      <Menu
        className="toggle-menu shadow"
        mode="vertical"
        theme="light"
        items={menuItems}
        onSelect={handleOnSelect}
      />}
    </div>
  );
};
