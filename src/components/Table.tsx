import React from 'react';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import '../assets/style/componentsStyle/Table.scss'


const App: any = (props: any) => <Table pagination={false} columns={props.columns} dataSource={props.data} scroll={{ y: 300 }} />;

export default App;