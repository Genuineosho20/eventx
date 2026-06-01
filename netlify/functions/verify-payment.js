export async function handler(event) {
    const params = event.queryStringParameters || {};
    const reference = params.reference;
    const expectedAmount = params.amount ? Number(params.amount) : null;

    if (!reference) {
        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, error: "Missing payment reference." })
        };
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: "Paystack secret key is not configured." })
        };
    }

    const url = `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${secretKey}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok || !data.status || !data.data) {
            return {
                statusCode: response.status || 400,
                body: JSON.stringify({ success: false, error: "Paystack verification failed.", details: data })
            };
        }

        if (data.data.status !== "success") {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, error: "Payment is not successful.", details: data.data })
            };
        }

        if (expectedAmount !== null && Number(data.data.amount) !== expectedAmount) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, error: "Payment amount mismatch.", data: data.data })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, data: data.data })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: "Verification request failed.", details: err.message })
        };
    }
}
