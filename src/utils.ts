interface Error {
  error: {
    code: string
    summary: string
    detail: string
  }
}

export const getErrorFromCli = (error: string): Error => {
  const allLines = error.toString().split("\n")
  const start = allLines.findIndex(line => line.slice(0, 1) === "{")
  const end = allLines
    .slice()
    .reverse()
    .findIndex(line => line.slice(0, 1) === "}")

  const jsonErrorLines = allLines.slice(start, -end).join("")
  const jsonError: Error = JSON.parse(jsonErrorLines)

  return jsonError
}
