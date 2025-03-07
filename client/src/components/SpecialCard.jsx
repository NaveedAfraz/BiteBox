import { specialOffers } from "@/config/details";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, X, Tag } from "lucide-react";

const SpecialCard = ({
  offerId = "new-user",
  specialOffers,
  title,
  restaurantPage,
}) => {
  return (
    <>
      <h1 className="text-2xl font-bold text-center flex justify-center items-center mb-6">
        {title}
      </h1>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4 md:grid-cols-2">
        {specialOffers?.map((offer) => {
          return (
            <Card
              key={offer.id}
              className={`w-full max-w-4xl mx-auto my-2 flex flex-col border-0 bg-gradient-to-r ${offer.gradient} shadow-lg relative overflow-hidden `}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute cursor-pointer top-2 right-2 text-white hover:bg-white/20 rounded-full"
              >
                <X size={18} />
              </Button>

              <CardContent className="p-4 flex flex-col items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white p-2 rounded-full mr-3">
                    {offer.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {offer.title}
                    </h3>
                    <div className="flex flex-col space-y-1 text-white">
                      <p className="text-base font-semibold">
                        {offer.description}
                      </p>
                      <p className="text-sm font-medium">
                        Use code:{" "}
                        <span className="bg-white/20 px-2 py-1 rounded text-white font-bold">
                          {offer.code}
                        </span>
                      </p>
                      {!restaurantPage && (
                        <div className="flex flex-col mt-1">
                          <span className="text-xs text-white/80">
                            {offer.additionalInfo}
                          </span>
                          <span className="text-xs bg-white/30 px-2 py-1 rounded-full w-fit mt-1">
                            {offer.target}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {!restaurantPage &&
                (offer?.expiryTime?.hours !== "00" ||
                  offer?.expiryTime?.minutes !== "00" ||
                  offer?.expiryTime?.seconds !== "00") ? (
                  <div className="flex flex-col items-center mt-4">
                    <div className="flex items-center justify-center bg-white/20 rounded-lg p-1 mb-1">
                      <Clock className="h-4 w-4 text-white mr-2" />
                      <p className="text-white font-medium text-sm">
                        Offer ends in:
                      </p>
                    </div>
                    <div className="flex space-x-2 text-white">
                      <div className="bg-white/20 w-10 h-10 rounded-md flex items-center justify-center">
                        <span className="text-lg font-bold">
                          {offer?.expiryTime?.hours}
                        </span>
                      </div>
                      <span className="text-lg font-bold self-center">:</span>
                      <div className="bg-white/20 w-10 h-10 rounded-md flex items-center justify-center">
                        <span className="text-lg font-bold">
                          {offer?.expiryTime?.minutes}
                        </span>
                      </div>
                      <span className="text-lg font-bold self-center">:</span>
                      <div className="bg-white/20 w-10 h-10 rounded-md flex items-center justify-center">
                        <span className="text-lg font-bold">
                          {offer?.expiryTime?.seconds}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  !restaurantPage && (
                    <div className="flex flex-col items-center mt-4">
                      <div className="bg-white/20 px-3 py-1 rounded-lg">
                        <p className="text-white font-medium text-sm">
                          Ongoing Offer
                        </p>
                      </div>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default SpecialCard;
