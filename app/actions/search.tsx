'use server'

type AddressComponent = {
    long_name: string
    short_name: string
    types: string[]
}

export type FullAddress = {
    street: string
    number: number
    zip: string
  }

export async function search(address: string): Promise<FullAddress> {
    const apiKey = process.env.GOOGLE_API_KEY
    
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(address)}&key=${apiKey}`
    )
    
    if (!response.ok) throw new Error('Failed to fetch')
        
    const data = await response.json()
    const addressComponents: AddressComponent[] = data.results[0].address_components
    const streetComponent =  addressComponents.find((component) => component.types.includes('route'));
    const numberComponent = addressComponents.find((component) => component.types.includes('street_number'));
    const postalCodeComponent = addressComponents.find((component) => component.types.includes('postal_code'));

    if (postalCodeComponent && streetComponent && numberComponent) {
        return {
            street: streetComponent.long_name,
            number: Number(numberComponent.long_name),
            zip: postalCodeComponent.long_name
        }
    } else {
        throw new Error("Postal Code not found.");
    }
}