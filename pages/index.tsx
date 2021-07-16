import Dragger from 'antd/lib/upload/Dragger'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import 'antd/dist/antd.css';
import { InboxOutlined } from '@ant-design/icons';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { Col, message, Row } from 'antd';
import { useEffect, useState } from 'react';
import { BarChart, ScatterChart, Scatter, Bar, Tooltip, Legend, XAxis, YAxis, ZAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios'
import { Spin } from 'antd';

const Upload = ({ onChange=(info: UploadChangeParam<UploadFile<any>>) => {} }) => {

  return (<Dragger
    name="file"
    multiple={false}
    action="/api/upload"
    onChange={onChange}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">
      please import a csv file that include the following fields
      <br />
      [ 'Student_ID', 'Semster_Name', 'Paper_ID', 'Paper_Name', 'Marks' ]
    </p>
  </Dragger>)
}

const BarStatistics = ({ data } : { data: any }) => {

  return (
    <ResponsiveContainer className={styles.chart} height={300}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <YAxis yAxisId="center" orientation="right" stroke="#82ca9d" />
        <YAxis yAxisId="right" orientation="right" stroke="#ca8187" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="min" fill="#8884d8" />
        <Bar yAxisId="center" dataKey="moyenne" fill="#82ca9d" />
        <Bar yAxisId="right" dataKey="max" fill="#ca8187" />
      </BarChart> 
  
  </ResponsiveContainer>)
}


const ScatterStatistics = ({ data } : { data: any }) => {
  
  return (
    <ResponsiveContainer className={styles.chart} height={300}>
        <ScatterChart
        width={400}
        height={400}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis type="number" dataKey="name" name="note" unit="" />
        <YAxis type="number" dataKey="count" name="count" unit="" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="A school" data={data} fill="#8884d8" />
      </ScatterChart>
      </ResponsiveContainer>
    )
}


const ScatterTimeLineStatistics = ({ data } : { data : any }) => {

  return (
    <div className={styles.chart} style={{ minHeight: 200 }}>
      {Object.keys(data).map((key: string, index: number, keys: Array<string>) => (
        <ResponsiveContainer width="100%" height={60} key={key}>
            <ScatterChart
              width={800}
              height={60}
              margin={{
                top: 10,
                right: 0,
                bottom: 0,
                left: 0,
              }}
            >
              <XAxis
                type="category"
                dataKey="mark"
                name="mark"
                interval={0}
                tick={ keys.length - 1 != index ? { fontSize: 0 } : {} }
                tickLine={{ transform: 'translate(0, -6)' }}
              />
              <YAxis
                type="number"
                dataKey="index"
                name="semster"
                height={10}
                width={80}
                tick={false}
                tickLine={false}
                axisLine={false}
                label={{ value: key, position: 'insideRight' }}
              />
              <ZAxis type="number" dataKey="count" range={[16, 200]} domain={[0, 100]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }}  />
              <Scatter data={data[key]} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
      ))
    }
    </div>
  )

}


export default function Home() {

  const [ isUploading, setIsUploading ] = useState(true)
  const [ isLoading, setIsLoading ] = useState(true)
  const [ statistics, setStatistics ] = useState<any>({})

  const onChange = (info: UploadChangeParam<UploadFile<any>>) => {
    const { status } = info.file

    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      setIsUploading(false)

      axios.get("/api/statistics").then(res =>{
        const statistics = res.data
        setStatistics(statistics)
        setIsLoading(false)
      })
      
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>PFE Statistics</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Statistics Extractor
        </h1>
      { isUploading ?
          <Upload onChange={onChange} /> :
          !isLoading ? <Row style={{ width: '100%' }}>
            <Col xs={12}>
              <BarStatistics data={statistics.Semsters.analyse} />
            </Col>
            <Col xs={12}>
              <ScatterStatistics data={statistics.marks} />
            </Col>
            <Col xs={24}>
              <ScatterTimeLineStatistics data={statistics.Semsters.marks} />
            </Col>
          </Row> : <Spin size="large" />
      }
      </main>
      <footer className={styles.footer}>
          Made By Anas & Othman
      </footer>
    </div>
  )
}
