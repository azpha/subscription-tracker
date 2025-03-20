import requests
import schedule
from datetime import date
import dateutil.parser

url = "http://localhost:3000"
discord_webhook_url = "https://discord.com/api/webhooks/1269149990878449724/8_F1GYDgW_9f7ZV3jgRzAzoLyPNuVAz1By4PJG4srRfelj4Y_oYQVR6Me8Kv4KwEhrxg"
discord_webhook_headers = {
    "content-type": "application/json"
}

def job():
    try:
        data = requests.get(f"{url}/api/trpc/subs.getUpcoming")
        json = data.json()
        subscriptions = json["result"]["data"]["json"]

        if len(subscriptions) > 0:
            fields = []

            for subscription in subscriptions:
                current_date = date.today()
                next_date = dateutil.parser.isoparse(subscription["nextBillingDate"]).date()
                difference = next_date - current_date

                fields.append(
                    {
                        "name": subscription["name"],
                        "value": f"{difference.days} day(s), {subscription["paymentMethod"]}",
                        "inline": True
                    }
                )

            send_discord_webhook_message({
                "username": "Subscriptions",
                "embeds": [
                    {
                        "title": "Subscriptions expiring!",
                        "description": "You have subscriptions expiring soon!",
                        "color": 16711680,
                        "fields": fields
                    }
                ]
            })
    except Exception as e:
        print("Failed to fetch subscriptions")
        send_discord_webhook_message({
            "username": "Subscriptions",
            "content": "<@288101780074528768>",
            "embeds": [
                {
                    "title": "Something went wrong!",
                    "description": "Check python script! ```" + str(e) + "```",
                    "color": 16711680
                }
            ]
        })

def send_discord_webhook_message(embed):
    requests.post(discord_webhook_url, json=embed, headers=discord_webhook_headers)

def main():
    schedule.every().day.do(job)
    # schedule.every(5).seconds.do(job)

    while True:
        schedule.run_pending()

main()