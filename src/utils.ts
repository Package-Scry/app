export interface Error {
  error: {
    code: string
    summary: string
    detail: string
  }
}

export const parseJSONFromCli = <T>(error: string): T => {
  try {
    const allLines = error.toString().split("\n")
    const start = allLines.findIndex(line => line.slice(0, 1) === "{")
    const end = allLines
      .slice()
      .reverse()
      .findIndex(line => line.slice(0, 1) === "}")

    const jsonErrorLines = allLines.slice(start, -end).join("")
    const jsonError: T = JSON.parse(jsonErrorLines)

    return jsonError
  } catch (error) {
    console.log("error while parsing", error)

    return null
  }
}

export const getErrorFromCli = (error: string): Error => {
  const jsonError = parseJSONFromCli<Error>(error)

  return (
    jsonError ?? {
      error: {
        code: "",
        summary: "Parse error",
        detail: "Couldn't parse cli error.",
      },
    }
  )
}
