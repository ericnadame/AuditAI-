"use client";
import AuditAI from "../artifacts/contracts/AuditAI.sol/AuditAI.json";
import { WavyBackground } from "@/components/ui/wavy-background";
import OpenAI from "openai";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ethers } from "ethers"; // Import Ethers.js

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});

const AVAX_NETWORK_PARAMS = {
  chainId: "0xA869", // Hexadecimal representation of 43113
  chainName: "Avalanche Fuji C-Chain",
  nativeCurrency: {
    name: "Avalanche Fuji C-Chain",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
  blockExplorerUrls: ["https://subnets-test.avax.network/c-chain"],
};

const switchToAvalancheFuji = async () => {
  const { ethereum } = window;
  if (!ethereum) {
    alert("Please install MetaMask!");
    return;
  }

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: AVAX_NETWORK_PARAMS.chainId }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [AVAX_NETWORK_PARAMS],
        });
      } catch (addError) {
        console.error("Failed to add the Avalanche Fuji network:", addError);
      }
    } else {
      console.error(
        "Failed to switch to the Avalanche Fuji network:",
        switchError
      );
    }
  }
};

export default function Home() {
  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState("");
  const [results, setResults] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const analyze = async () => {
    setLoading(true);
    setIsModalOpen(true);
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Your role and goal is to be an AI Smart Contract Auditor. Your job is to perform an audit on the given smart contract. Here is the smart contract: ${contract}.
        
          Please provide the results in the following array format for easy front-end display:
    
          [
            {
              "section": "Audit Report",
              "details": "A detailed audit report of the smart contract, covering security, performance, and any other relevant aspects."
            },
            {
              "section": "Metric Scores",
              "details": [
                {
                  "metric": "Security",
                  "score": 0-10
                },
                {
                  "metric": "Performance",
                  "score": 0-10
                },
                {
                  "metric": "Other Key Areas",
                  "score": 0-10
                },
                {
                  "metric": "Gas Efficiency",
                  "score": 0-10
                },
                {
                  "metric": "Code Quality",
                  "score": 0-10
                },
                {
                  "metric": "Documentation",
                  "score": 0-10
                }
              ]
            },
            {
              "section": "Suggestions for Improvement",
              "details": "Suggestions for improving the smart contract in terms of security, performance, and any other identified weaknesses."
            }
          ]
          
          Thank you.`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const auditResults = JSON.parse(chatCompletion.choices[0].message.content);
    setResults(auditResults);
    auditSmartContract();
    setLoading(false);
  };

  const auditSmartContract = async () => {
    setLoading(true);
    try {
      await switchToAvalancheFuji();

      const { ethereum } = window;
      if (!ethereum) {
        alert("Please install MetaMask!");
        setLoading(false);
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const contractCode = contract;
      const auditReport = "This is a sample audit report";

      const contractAddress = "0xd89D6f137aDF52FDA3de85ceA6326D7526a47783";
      const abi = AuditAI.abi;
      const contractInstance = new ethers.Contract(
        contractAddress,
        abi,
        signer
      );

      const tx = await contractInstance.auditSmartContract(
        contractCode,
        auditReport
      );
      await tx.wait();

      console.log("Smart contract audited and event emitted.");
      setLoading(false);
    } catch (error) {
      console.error("Error auditing smart contract:", error);
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between p-24">
      <WavyBackground className="max-w-4xl mx-auto pb-40">
        <p className="text-4xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
          AuditAI, Smart Contract Auditor
        </p>
        <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
          Leverage the power of AI to audit your smart contracts
        </p>
      </WavyBackground>

      <div className="relative lg:w-4/6 w-full mx-auto">
        <textarea
          id="hs-textarea-ex-1"
          rows={10}
          value={contract}
          onChange={(e) => setContract(e.target.value)}
          className="p-4 pb-12 block w-full text-lg rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          placeholder="Paste your smart contract here..."
        ></textarea>

        <div className="absolute bottom-px inset-x-px p-2 rounded-b-md bg-white dark:bg-neutral-900">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {/* onClick={} */}
              <button
                type="button"
                class="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:text-blue-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-neutral-500 dark:hover:text-blue-500"
              >
                <svg
                  class="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <line x1="9" x2="15" y1="15" y2="9"></line>
                </svg>
              </button>

              <button
                type="button"
                class="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:text-blue-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-neutral-500 dark:hover:text-blue-500"
              >
                <svg
                  class="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-x-1">
              <button
                type="button"
                class="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:text-blue-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-neutral-500 dark:hover:text-blue-500"
              >
                <svg
                  class="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" x2="12" y1="19" y2="22"></line>
                </svg>
              </button>
              <button
                onClick={analyze}
                type="button"
                className="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg
                  className="flex-shrink-0 size-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4 text-center">
          <div
            className="fixed inset-0 bg-black opacity-50"
            aria-hidden="true"
          ></div>
          <div className="bg-white dark:bg-neutral-900 rounded-lg overflow-hidden shadow-xl transform transition-all max-w-3xl w-full p-8 space-y-8">
            {loading ? (
              <div className="flex flex-col items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8V4a8 8 0 00-8 8z"
                  ></path>
                </svg>
                <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
                  Analyzing smart contract...
                </p>
              </div>
            ) : (
              results && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      Audit Results
                    </h2>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Close
                    </button>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                      <svg
                        className="w-6 h-6 mr-2 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      Audit Report
                    </h3>
                    <p className="text-base text-gray-700 dark:text-gray-300">
                      {
                        results.find((r) => r.section === "Audit Report")
                          .details
                      }
                    </p>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                      <svg
                        className="w-6 h-6 mr-2 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4H9m4 4h1a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v7a2 2 0 002 2h1m0 0h1v4h-1m1 0h4m0 0v-4m0 0h1m0 0v-4m0 0H7m0 0H5m0 0v4m0 0v4"
                        ></path>
                      </svg>
                      Metric Scores
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {results
                        .find((r) => r.section === "Metric Scores")
                        .details.map((metric, metricIndex) => {
                          let color;
                          if (metric.score >= 8) color = "#4caf50"; // green
                          else if (metric.score < 5) color = "#f44336"; // red
                          else color = "#ffeb3b"; // yellow
                          return (
                            <div
                              key={metricIndex}
                              className="flex flex-col items-center"
                            >
                              <div className="w-16 h-16">
                                <CircularProgressbar
                                  value={metric.score * 10}
                                  text={`${metric.score}/10`}
                                  styles={buildStyles({
                                    textSize: "16px",
                                    pathColor: color,
                                    textColor: color,
                                    trailColor: "#d6d6d6",
                                  })}
                                />
                              </div>
                              <p className="text-center mt-2 text-gray-700 dark:text-gray-300">
                                {metric.metric}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                      <svg
                        className="w-6 h-6 mr-2 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4H9m4 4h1a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v7a2 2 0 002 2h1m0 0h1v4h-1m1 0h4m0 0v-4m0 0h1m0 0v-4m0 0H7m0 0H5m0 0v4m0 0v4"
                        ></path>
                      </svg>
                      Suggestions for Improvement
                    </h3>
                    <p className="text-base text-gray-700 dark:text-gray-300">
                      {
                        results.find(
                          (r) => r.section === "Suggestions for Improvement"
                        ).details
                      }
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </Dialog>
    </main>
  );
}
