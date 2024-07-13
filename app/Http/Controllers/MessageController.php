<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use App\Events\MessageSent;
use Illuminate\Support\Facades\Log;


class MessageController extends Controller
{
    public function sendMessage(Request $request)
    {
        try {
            $message = Message::create([
                'name' => $request->name,
                'message' => $request->message,
            ]);
    
            broadcast(new MessageSent($message))->toOthers();
    
            return response()->json(['status' => 'Message sent successfully']);
        } catch (\Exception $e) {
            Log::error('Error sending message: ' . $e->sendMessage(), [
                'exception' => $e,
                'request' => $request->all()
            ]);
    
            return response()->json(['error' => 'An error occurred while sending the message'], 500);
        }
    }

    public function getOldestMessages(Request $request)
    {
        try {
            //use asc to show oldest message
            return Message::orderBy('created_at', 'asc')->take(50)->get();
        } catch(\Exception $e) {
            Log::error('Error fecth message:'. $e->getMessages(), [
                'exception' => $e,
                'request' => $request->all()
            ]);
            return response()->json(['error' => 'An error occurred while fetch the message'], 500);
        }
    }
    public function getLatestMessages(Request $request)
    {
        try {
            //use desc to show latest message
            return Message::orderBy('created_at', 'desc')->take(50)->get();
        } catch(\Exception $e) {
            Log::error('Error fecth message:'. $e->getMessages(), [
                'exception' => $e,
                'request' => $request->all()
            ]);
            return response()->json(['error' => 'An error occurred while fetch the message'], 500);
        }
    }
}
