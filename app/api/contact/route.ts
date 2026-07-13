import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, phone, insuranceType } = body ?? {}

    if (!firstName || !lastName || !phone || !insuranceType) {
      return NextResponse.json(
        { error: "Please fill in your name, phone number and the type of cover you need." },
        { status: 400 },
      )
    }

    // NOTE: Email delivery is not wired up yet. This endpoint simply
    // acknowledges the request so the quote form works end to end.
    // Hook up an email/SMTP or CRM provider here when ready.
    return NextResponse.json({
      message:
        "Thank you! Your request has been received. A Quantz advisor will contact you shortly. For urgent queries call +264 81 820 1522.",
    })
  } catch {
    return NextResponse.json(
      { error: "Could not process your request. Please call us on +264 81 820 1522." },
      { status: 500 },
    )
  }
}
