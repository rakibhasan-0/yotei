//import React from "react"
import { render, configure, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import ExerciseEdit from "../../../pages/Activity/Exercise/ExerciseEdit"
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from "react-router-dom"
import { rest } from "msw"
import { server } from "../../server"
configure({ testIdAttribute: "id" })