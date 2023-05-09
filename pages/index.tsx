import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import FuseLogo from "img/fuse-logo.svg";
import Image from "next/image";
import styled from "styled-components";

import TextInput from "components/TextInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactDropdown from "react-dropdown";
import { TopicOptions } from "helper/topics";

const DateField = styled(DatePicker)`
  border: 1px solid #000;
  max-width: 600px;
  width: 100%;
  border-radius: 4px;
  font-size: 16px;
  padding: 8px 16px;
  transition: all 0.2s ease-in-out;

  padding: 12px 16px;
  border: 1px solid #10a37f;
  border-radius: 4px;
  outline-color: #10a37f;
`;

const Button = styled.button`
  width: 100%;
  text-align: center;
  max-width: 300px;
  align-self: flex-end;
  background-color: #596ac7;
  border: 1px solid #596ac7;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  padding: 8px 16px;
  transition: all 0.2s ease-in-out;
  &:disabled {
    background-color: #dddddd;
  }
  &:hover {
    background-color: #4c5ec1;
    border: 1px solid #4c5ec1;
  }
`;

const Form = styled.form`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
`;

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [eventName, setEventName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [hotels, setHotels] = useState<string>("");
  const [artists, setArtists] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setResult("");
    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventName,
          location,
          startDate,
          endDate,
          hotels,
          artists,
          topic,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = response.body;
      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setResult((prev) => prev + chunkValue);
      }
      setLoading(false);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
      setLoading(false);
    }
  };

  const isDisabled =
    loading ||
    !eventName ||
    !location ||
    !startDate ||
    !endDate ||
    !hotels ||
    !artists ||
    !topic;

  return (
    <div className="p-4">
      <Head>
        <title>JamTrack</title>
        <link rel="icon" href="img/favicon.svg" />
      </Head>

      <main className={styles.main}>
        <div className="d-flex align-items-center mb-5">
          <Image src={FuseLogo} width={200} alt="Fuse Logo" />
          <h2 className="text-white ms-4 ">JamTrack</h2>
        </div>
        <Form onSubmit={(e) => onSubmit(e)}>
          <TextInput
            label="Event name"
            placeholder="Enter the event name"
            value={eventName}
            setValue={setEventName}
          />
          <TextInput
            label={"Event location"}
            placeholder={"Enter the event location"}
            value={location}
            setValue={setLocation}
          />
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="text-nowrap">Start date:</div>
            <DateField
              selected={startDate}
              placeholderText="Select a date"
              onChange={(date) => setStartDate(date as Date)}
            />
          </div>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="text-nowrap">End date:</div>
            <DateField
              selected={endDate}
              placeholderText="Select a date"
              onChange={(date) => setEndDate(date as Date)}
            />
          </div>
          <TextInput
            label={"Featured artists"}
            placeholder={"Enter a few of the featured artists"}
            value={artists}
            setValue={setArtists}
          />
          <TextInput
            label={"Hotels"}
            placeholder={"Enter a few of the hotels"}
            value={hotels}
            setValue={setHotels}
          />
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="text-nowrap">Select a topic:</div>
            <ReactDropdown
              options={TopicOptions.filter(
                (options) => options.value !== topic
              )}
              onChange={(option) => setTopic(option.value)}
              // value={TopicOptions[0]}
              placeholder={`Select an option`}
            />
          </div>

          <Button type="submit" disabled={isDisabled} value="Generate names">
            Generate Email{" "}
          </Button>
        </Form>
        {loading && (
          <div className="d-flex align-items-center justify-content-center opacity-75">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {result && (
          <div className="d-flex flex-column align-items-start">
            <h4 className="mb-3">Email Content:</h4>
            <div className="w-100">{result}</div>
          </div>
        )}
      </main>
    </div>
  );
}
