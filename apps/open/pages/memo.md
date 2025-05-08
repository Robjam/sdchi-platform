## Calendar design:
```TypeScript
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react"

interface BusinessHours {
  open: string
  close: string
  closed: boolean
}

interface DaySchedule {
  [key: string]: BusinessHours // key format: "YYYY-MM-DD"
}

const defaultDayHours: BusinessHours = {
  open: "9:00 AM",
  close: "6:00 PM",
  closed: false,
}

const weekendHours: BusinessHours = {
  open: "10:00 AM",
  close: "4:00 PM",
  closed: false,
}

const sundayHours: BusinessHours = {
  open: "",
  close: "",
  closed: true,
}

export default function BusinessHoursPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [changePrompt, setChangePrompt] = useState("")

  // Generate default schedule for the month
  const generateDefaultSchedule = (date: Date): DaySchedule => {
    const schedule: DaySchedule = {}
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day)
      const dayOfWeek = currentDay.getDay()
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

      if (dayOfWeek === 0) {
        // Sunday
        schedule[dateKey] = sundayHours
      } else if (dayOfWeek === 6) {
        // Saturday
        schedule[dateKey] = weekendHours
      } else {
        // Weekdays
        schedule[dateKey] = defaultDayHours
      }
    }
    return schedule
  }

  const [schedule, setSchedule] = useState<DaySchedule>(generateDefaultSchedule(currentDate))

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
    setSchedule(generateDefaultSchedule(newDate))
  }

  const getDateKey = (day: number) => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const handleSubmitChanges = () => {
    if (changePrompt.trim()) {
      console.log("Change prompt submitted:", changePrompt)
      setChangePrompt("")
    }
  }

  const days = getDaysInMonth(currentDate)
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Business Hours</h1>
          </div>
          <p className="text-sm text-gray-600">Monthly operating schedule</p>
        </div>

        {/* Monthly Calendar */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" />
                {formatMonth(currentDate)}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="p-2 text-center text-xs font-medium text-gray-600 bg-gray-100 rounded">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={index} className="aspect-square" />
                }

                const dateKey = getDateKey(day)
                const daySchedule = schedule[dateKey]
                const isToday =
                  new Date().toDateString() ===
                  new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

                return (
                  <div
                    key={day}
                    className={`aspect-square border rounded-lg p-1 flex flex-col ${
                      isToday ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
                    }`}
                  >
                    <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : "text-gray-900"}`}>
                      {day}
                    </div>
                    <div className="flex-1 text-xs">
                      {daySchedule?.closed ? (
                        <span className="text-red-600 font-medium">Closed</span>
                      ) : (
                        <div className="space-y-0.5">
                          <div className="text-green-600 font-medium">{daySchedule?.open}</div>
                          <div className="text-gray-600">{daySchedule?.close}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Change Prompts Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Request Changes</CardTitle>
            <p className="text-sm text-gray-600">Describe any changes you'd like to make to the business hours</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="change-prompt" className="text-sm font-medium">
                Change Request
              </Label>
              <Textarea
                id="change-prompt"
                placeholder="e.g., 'Close early on December 24th' or 'Extend hours on weekends in January'"
                value={changePrompt}
                onChange={(e) => setChangePrompt(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>
            <Button onClick={handleSubmitChanges} className="w-full" disabled={!changePrompt.trim()}>
              Submit Changes
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-12">
            Emergency Hours
          </Button>
          <Button variant="outline" className="h-12">
            Holiday Schedule
          </Button>
        </div>
      </div>
    </div>
  )
}
```